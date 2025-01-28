import {put, call, select, delay, takeLeading} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {TRootState} from '../boot/configureStore';
import {createLicenceApi, paymentListApi, getLastPaymentApi, lastPaymentApi, allCompaniesApi} from '../api/api';
import {ICreateLicenseModel, ICreateLicenseResponse} from '../models/ICreateLicenseModel';
import {isInternetReachable} from '../reducers';
import {RefreshAction} from '../models/IRefreshResult.ts';
import {ICompanyModel} from '../models/ICompanyModel.ts';
import {AxiosResponse} from 'axios';
import {
    allCompaniesFailureResponse,
    allCompaniesSuccessResponse,
    handleAllCompanies,
    handleLastPayment,
    handlePaymentList,
    handleRenewLicense,
    lastPaymentFailureResponse,
    lastPaymentSuccessResponse,
    paymentListFailureResponse,
    paymentListSuccessResponse,
    renewLicenseFailureResponse,
    renewLicenseSuccessResponse,
} from '../actions/homeActions.ts';
import {showLoadingIndicator, hideLoadingIndicator, noneInternetConnection} from '../actions/appServiceActions.ts';
import {handleRefresh} from '../actions/authenticationActions.ts';

function* getLastPayment({payload, type}: PayloadAction<number | undefined>) {
    let state: TRootState = yield select();
    // show a loader
    yield put(showLoadingIndicator());
    yield delay(1000);//wait 1 sec
    //wait for a stable internet connection
    while (
        state.appServiceReducer.netInfoState.isInternetReachable === null ||
        state.appServiceReducer.netInfoState.isInternetReachable === undefined
        ) {
        yield delay(100);
        state = yield select();
    }
    if (state.authenticationReducer.refreshToken === '') {
        //Refresh Token, and then call this request again
        yield put(handleRefresh(new RefreshAction(type, payload)));
        return;
    }
    try {
        let response: AxiosResponse<ICreateLicenseResponse>;
        if (typeof payload === 'undefined') {
            // @ts-ignore
            response = yield call(getLastPaymentApi);
        } else {
            // @ts-ignore
            response = yield call(lastPaymentApi, payload);
        }
        if (response.status === 200) {
            const apiResponse = response.data as ICreateLicenseResponse;
            yield put(lastPaymentSuccessResponse(apiResponse));
        }
    } catch (error: any) {
        if (error.status === 401) {
            //Refresh Token, and then call this request again
            yield put(handleRefresh(new RefreshAction(type, payload)));
            return;
        }
        console.log(error);
        Sentry.captureException(error);
        yield put(lastPaymentFailureResponse(error));
    }

    //In case if no user profile exists, call user profile
    state = yield select();
    if (state.profileReducer.user.LastActivityTime === '') {
        yield put(handleRefresh(new RefreshAction()));
    }

    yield put(hideLoadingIndicator());
}

function* getPaymentList({payload, type}: PayloadAction<any>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put(showLoadingIndicator());
        yield delay(1000);//wait 1 sec
        try {
            // @ts-ignore
            const paymentList: any = yield call(paymentListApi);
            if (paymentList.status === 200) {
                const response = paymentList.data as ICreateLicenseResponse[];
                yield put(paymentListSuccessResponse(response));
                yield put(handleAllCompanies());
            }
        } catch (error: any) {
            if (error.status === 401) {
                //Refresh Token, and then call this request again
                yield put(handleRefresh(new RefreshAction(type, payload)));
                return;
            }
            console.log(error);
            Sentry.captureException(error);
            yield put(paymentListFailureResponse(error));
        } finally {
            yield put(hideLoadingIndicator());
        }
    } else {
        yield put(noneInternetConnection());
    }
}

function* getAllCompanies({payload, type}: PayloadAction<any>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put(showLoadingIndicator());
        try {
            // @ts-ignore
            const allCompanies: any = yield call(allCompaniesApi);
            if (allCompanies.status === 200) {
                const response = allCompanies.data as ICompanyModel[];
                yield put(allCompaniesSuccessResponse(response));
            }
        } catch (error: any) {
            if (error.status === 401) {
                //Refresh Token, and then call this request again
                yield put(handleRefresh(new RefreshAction(type, payload)));
                return;
            }
            console.log(error);
            Sentry.captureException(error);
            yield put(allCompaniesFailureResponse(error));
        } finally {
            yield put(hideLoadingIndicator());
        }
    } else {
        yield put(noneInternetConnection());
    }
}

function* renewLicense({payload, type}: PayloadAction<ICreateLicenseModel>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put(showLoadingIndicator());
        try {
            // @ts-ignore
            const newLicense: any = yield call(createLicenceApi, payload);
            if (newLicense.status === 200) {
                const response = newLicense.data as ICreateLicenseResponse;
                yield put(renewLicenseSuccessResponse(response));
            }
        } catch (error: any) {
            if (error.status === 401) {
                //Refresh Token, and then call this request again
                yield put(handleRefresh(new RefreshAction(type, payload)));
                return;
            }
            console.log(error);
            Sentry.captureException(error);
            yield put(renewLicenseFailureResponse(error));
        } finally {
            yield put(hideLoadingIndicator());
        }
    } else {
        yield put(noneInternetConnection());
    }
}

export default function* homeScreenFlow() {
    yield takeLeading(handleLastPayment, getLastPayment);
    yield takeLeading(handlePaymentList, getPaymentList);
    yield takeLeading(handleAllCompanies, getAllCompanies);
    yield takeLeading(handleRenewLicense, renewLicense);
}
