import {put, call, takeLeading, select, delay} from 'redux-saga/effects';
import {Buffer} from 'buffer';
import {PayloadAction} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import * as Sentry from '@sentry/react-native';
import {getTokenFromKeychain} from '../utils/keychainStorage.ts';
import {HttpStatusCode} from 'axios';
import {loginApi, logoutApi} from '../api/api.ts';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage.ts';
import {ILoginResponse} from '../models/ILoginResponse.ts';
import {ICredentials} from '../models/ICredentials.ts';
import {
  IAuthorizeResult,
  IRefreshAction,
  RefreshAction,
} from '../models/IRefreshResult.ts';
import {Errors} from '../models/IErrorModel.ts';
import {isInternetReachable, isRegistered} from '../reducers';
import {
  CONNECTION_RETRY_DELAY_MS,
  MAX_CONNECTION_RETRIES,
} from '../config.ts';
import {TRootState} from '../boot/configureStore.ts';
import {getUserSuccess} from '../actions/profileActions.ts';
import {
    authStateChanged,
    showLoadingIndicator,
    hideLoadingIndicator,
    noneInternetConnection,
    logoutUser,
} from '../actions/appServiceActions.ts';
import {
    handleAuthorize,
    authorizationSuccess,
    authorizationFailure,
    handleRefresh,
    refreshTokenSuccess,
    refreshTokenFailure,
    handleRevoke,
    revokeTokenSuccess,
    revokeTokenFailure,
} from '../actions/authenticationActions.ts';

function* saveCredentials(login: string, stringify: IAuthorizeResult) {
    yield call([Keychain, Keychain.setGenericPassword], login, JSON.stringify(stringify));
}

/**
 * Waits for the internet connection to be available.
 * It first waits for the connection status to be determined, then retries
 * for a short period if initially disconnected.
 * @returns A generator that yields a boolean indicating if the connection is available.
 */
export function* waitForInternetConnection(): Generator<any, boolean, boolean | null> {
  // Wait for a stable Internet connection state (not null)
  let isInternet: boolean | null = yield select(isInternetReachable);
  while (isInternet === null) {
    yield delay(CONNECTION_RETRY_DELAY_MS);
    isInternet = yield select(isInternetReachable);
  }

  // If not connected, retry for a short duration
  let retries = 0;
  while (!isInternet && retries < MAX_CONNECTION_RETRIES) {
    yield delay(CONNECTION_RETRY_DELAY_MS);
    retries++;
    isInternet = yield select(isInternetReachable);
  }

  if (!isInternet) {
    yield put(noneInternetConnection());
    return false;
  }

  return true;
}

function* register({payload}: PayloadAction<ICredentials>) {
    const isInternet: boolean = yield call(waitForInternetConnection);
    if (!isInternet) {
        yield put(noneInternetConnection());
        return;
    }
    // show a loader
    yield put(showLoadingIndicator());
    const token = Buffer.from(`${payload.login}:${payload.password}`).toString('base64');
    const username: string = payload.login;
    let stringify: IAuthorizeResult = {
        accessToken: token,
        refreshToken: '',
    };

    try {
        yield saveCredentials(username, stringify);

        const login: {status: number, data: ILoginResponse} = yield call([loginApi, loginApi.get], '', {headers: {Authorization: `Basic ${token}`}});
        if (login.status === HttpStatusCode.Ok) {
            const response = login.data as ILoginResponse;
            stringify = {
                accessToken: token,
                refreshToken: response.token,
            };
            yield saveCredentials(username, stringify);
            yield put(authorizationSuccess(stringify));
            yield put(getUserSuccess(response));
        }
    } catch (error: any) {
        Sentry.captureException(error.originalError || error);
        console.log(error);
        yield put(authStateChanged(false));
        yield put(authorizationFailure(error));
    } finally {
        yield put(hideLoadingIndicator());
    }
}

function* refreshToken({payload}: PayloadAction<IRefreshAction>) {
    let isUserRegistered: boolean | undefined = yield select(isRegistered);
    while (isUserRegistered === undefined) {
        yield delay(100);
        isUserRegistered = yield select(isRegistered);
    }
    try {
      const credentials: Keychain.UserCredentials | false = yield call([Keychain, Keychain.getGenericPassword]);
      if (credentials) {
          const token: string | null = yield call(getTokenFromKeychain, KEYCHAIN_TOKEN_KEY.accessToken);

          const login: {status: number, data: ILoginResponse} = yield call([loginApi, loginApi.get], '', {headers: {Authorization: `Basic ${token}`}});
          if (login.status === HttpStatusCode.Ok) {
              const response = login.data as ILoginResponse;
              const stringify = {
                  accessToken: token!,
                  refreshToken: response.token,
              };
              yield saveCredentials(credentials.username, stringify);
              yield put(refreshTokenSuccess({refreshToken: response.token}));
              yield put(getUserSuccess(response as ILoginResponse));
              //Reload the last call
              yield put({
                  type: payload.type,
                  payload: payload.payload,
              });
          }
      } else {
          yield put(refreshTokenFailure(new Errors(0, [], [payload.type + '|' + payload.payload])));
          yield put(logoutUser());
      }
    } catch (error: any) {
        Sentry.captureException(error.originalError || error);
        console.log(error);
        yield put(refreshTokenFailure(error));
        yield put(logoutUser());
    }
}

function* revokeToken({payload, type}: PayloadAction<any>) {
    const isInternet: boolean = yield call(waitForInternetConnection);
    if (!isInternet) {
        yield put(noneInternetConnection());
        return;
    }
    // show a loader
    yield put(showLoadingIndicator());
    const state: TRootState = yield select();
    try {
        yield call([logoutApi, logoutApi.get], '', {headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        yield put(logoutUser());
        yield put(revokeTokenSuccess());
    } catch (error: any) {
        if (error.status === HttpStatusCode.Unauthorized) {
          yield put(handleRefresh(new RefreshAction(type, payload)));
          return;
        }
        console.log(error);
        yield put(revokeTokenFailure(error));
    } finally {
        yield put(hideLoadingIndicator());
    }
}

function* logout() {
    yield call([Keychain, Keychain.resetGenericPassword]);
}

export default function* authorizeFlow() {
    yield takeLeading(handleAuthorize, register);
    yield takeLeading(handleRefresh, refreshToken);
    yield takeLeading(handleRevoke, revokeToken);
    yield takeLeading(logoutUser, logout);
}
