import {PayloadAction} from '@reduxjs/toolkit';
import {
  ICreateKhymcorLicenseModel, ICreateKhymcorLicenseResponse,
} from '../models/ICreateLicenseModel.ts';
import {call, put, select, takeLeading} from 'redux-saga/effects';
import {
  hideLoadingIndicator,
  noneInternetConnection,
  showLoadingIndicator,
} from '../actions/appServiceActions.ts';
import {licenseApi} from '../api/api.ts';
import {HttpStatusCode} from 'axios';
import * as Sentry from '@sentry/react-native';
import {handleRenewKhymcorLicense, renewLicenseFailureResponse, renewLicenseSuccessResponse} from '../actions/homeActions.ts';
import {waitForInternetConnection} from './authenticationSaga.ts';
import {TRootState} from '../boot/configureStore.ts';
import {handleRefresh} from '../actions/authenticationActions.ts';
import {RefreshAction} from '../models/IRefreshResult.ts';

function* renewKhymcorLicense({payload, type}: PayloadAction<ICreateKhymcorLicenseModel>) {
  const isInternet: boolean = yield call(waitForInternetConnection);
  if (!isInternet) {
    yield put(noneInternetConnection());
    return;
  }
  // show a loader
  yield put(showLoadingIndicator());
  const state: TRootState = yield select();
  try {
    const newLicense: {status: number; data: ICreateKhymcorLicenseResponse} =
      yield call(
        [licenseApi, licenseApi.post],
        '',
        {...payload},
        {
          headers: {
            Authorization: `Bearer ${state.authenticationReducer.refreshToken}`,
          },
        },
      );
    if (newLicense.status === HttpStatusCode.Ok) {
      const response = newLicense.data as ICreateKhymcorLicenseResponse;
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

export default function* khymcorFlow() {
  yield takeLeading(handleRenewKhymcorLicense, renewKhymcorLicense);
}
