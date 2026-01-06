import {PayloadAction} from '@reduxjs/toolkit';
import {ICreateLicenseModel, ICreateOldLicenseResponse} from '../models/ICreateLicenseModel.ts';
import {call, put, select, takeLeading} from 'redux-saga/effects';
import {isInternetReachable} from '../reducers';
import {hideLoadingIndicator, noneInternetConnection, showLoadingIndicator} from '../actions/appServiceActions.ts';
import {licenseOldApi} from '../api/api.ts';
import {HttpStatusCode} from 'axios';
import {
    handleRenewOldLicense,
    renewOldLicenseFailureResponse,
    renewOldLicenseSuccessResponse,
} from '../actions/florsemActions.ts';
import * as Sentry from '@sentry/react-native';

function* renewLicense({payload}: PayloadAction<ICreateLicenseModel>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (!isInternet) {
        yield put(noneInternetConnection());
        return;
    }
    // show a loader
    yield put(showLoadingIndicator());
    try {
        const newLicense: {status: number, data: ICreateOldLicenseResponse} = yield call([licenseOldApi, licenseOldApi.post], '', {...payload});
        if (newLicense.status === HttpStatusCode.Ok) {
            const response = newLicense.data as ICreateOldLicenseResponse;
            yield put(renewOldLicenseSuccessResponse(response));
        }
    } catch (error: any) {
        console.log(error);
        Sentry.captureException(error.originalError || error);
        yield put(renewOldLicenseFailureResponse(error));
    } finally {
        yield put(hideLoadingIndicator());
    }
}

export default function* florsemOldFlow() {
    yield takeLeading(handleRenewOldLicense, renewLicense);
}
