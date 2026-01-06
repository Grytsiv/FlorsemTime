import {put, call, select, takeLeading} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {HttpStatusCode} from 'axios';
import {TRootState} from '../boot/configureStore';
import {paymentListApi} from '../api/api';
import {ICompanyResponse} from '../models/ICreateLicenseModel';
import {RefreshAction} from '../models/IRefreshResult.ts';
import {
    handlePaymentList,
    paymentListFailureResponse,
    paymentListSuccessResponse,
} from '../actions/homeActions.ts';
import {showLoadingIndicator, hideLoadingIndicator, noneInternetConnection} from '../actions/appServiceActions.ts';
import {handleRefresh} from '../actions/authenticationActions.ts';
import {waitForInternetConnection} from './authenticationSaga.ts';

export function* getPaymentList({payload, type}: PayloadAction<any>) {
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
        Sentry.captureException(error.originalError || error);
        yield put(paymentListFailureResponse(error));
    } finally {
        yield put(hideLoadingIndicator());
    }
}

export default function* homeScreenFlow() {
    yield takeLeading(handlePaymentList, getPaymentList);
}
