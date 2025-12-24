import {put, call, select, delay, takeLeading} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {HttpStatusCode} from 'axios';
import {TRootState} from '../boot/configureStore';
import {licenseApi, paymentListApi, getLastPaymentApi} from '../api/api';
import {
  ICompanyResponse,
  ICreateKhymkorLicenseModel,
  ICreateKhymkorLicenseResponse,
  ICreateLicenseResponse,
} from '../models/ICreateLicenseModel';
import {RefreshAction} from '../models/IRefreshResult.ts';
import {
    handleLastPayment,
    handlePaymentList,
    handleRenewKhymkorLicense,
    lastPaymentFailureResponse,
    lastPaymentSuccessResponse,
    paymentListFailureResponse,
    paymentListSuccessResponse,
    renewLicenseFailureResponse,
    renewLicenseSuccessResponse,
} from '../actions/homeActions.ts';
import {showLoadingIndicator, hideLoadingIndicator, noneInternetConnection} from '../actions/appServiceActions.ts';
import {handleRefresh} from '../actions/authenticationActions.ts';
import {waitForInternetConnection} from './authenticationSaga.ts';

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
    state = yield select();
    try {
        let response: {status: number, data: ICreateLicenseResponse};
        if (typeof payload === 'undefined') {
            response = yield call([getLastPaymentApi, getLastPaymentApi.get], '', {headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        } else { //`?companyId=${payload}`
            response = yield call([getLastPaymentApi, getLastPaymentApi.get], '', {params: {companyId: payload}, headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        }
        if (response.status === HttpStatusCode.Ok) {
            const apiResponse = response.data as ICreateLicenseResponse;
            yield put(lastPaymentSuccessResponse(apiResponse));
        }
    } catch (error: any) {
        if (error.status === HttpStatusCode.Unauthorized) {
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
    if (state.profileReducer.user.token === '') {
        yield put(handleRefresh(new RefreshAction()));
    }

    yield put(hideLoadingIndicator());
}

function* getPaymentList({payload, type}: PayloadAction<any>) {
  const isInternet: boolean = yield call(waitForInternetConnection);
    if (!isInternet) {
        yield put(noneInternetConnection());
        return;
    }

    // show a loader
    yield put(showLoadingIndicator());

    const state: TRootState = yield select();

    try {
        const paymentList: {status: number, data: ICompanyResponse[]} = yield call([paymentListApi, paymentListApi.get], '', {headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        if (paymentList.status === HttpStatusCode.Ok) {
            const response = paymentList.data as ICompanyResponse[];
            yield put(paymentListSuccessResponse(response));
            if (state.profileReducer.user.id === (-1)) {
              yield put(handleRefresh(new RefreshAction()));
            }
        }
    } catch (error: any) {
        if (error.status === HttpStatusCode.Unauthorized) {
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
}

function* renewKhymkorLicense({payload, type}: PayloadAction<ICreateKhymkorLicenseModel>) {
    const isInternet: boolean = yield call(waitForInternetConnection);
    if (!isInternet) {
        yield put(noneInternetConnection());
        return;
    }
    // show a loader
    yield put(showLoadingIndicator());
    const state: TRootState = yield select();
    try {
        const newLicense: {status: number, data: ICreateKhymkorLicenseResponse} = yield call([licenseApi, licenseApi.post], '', {...payload}, {headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        if (newLicense.status === HttpStatusCode.Ok) {
            const response = newLicense.data as ICreateKhymkorLicenseResponse;
            yield put(renewLicenseSuccessResponse(response));
        }
    } catch (error: any) {
        if (error.status === HttpStatusCode.Unauthorized) {
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
}

export default function* homeScreenFlow() {
    yield takeLeading(handleLastPayment, getLastPayment);
    yield takeLeading(handlePaymentList, getPaymentList);
    yield takeLeading(handleRenewKhymkorLicense, renewKhymkorLicense);
}
