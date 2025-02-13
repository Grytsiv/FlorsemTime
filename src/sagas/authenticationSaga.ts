import {put, call, takeLeading, select, delay} from 'redux-saga/effects';
import {Buffer} from 'buffer';
import {PayloadAction} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import * as Sentry from '@sentry/react-native';
import {getTokenFromKeychain} from '../utils/keychainStorage.ts';
import {HttpStatusCode} from 'axios';
import {deviceApi, loginApi, logoutApi} from '../api/api.ts';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage.ts';
import {ILoginResponse} from '../models/ILoginResponse.ts';
import {ICredentials} from '../models/ICredentials.ts';
import {IAuthorizeResult, IRefreshAction} from '../models/IRefreshResult.ts';
import {IDeviceResponse} from '../models/IDeviceResponse.ts';
import {Errors} from '../models/IErrorModel.ts';
import {isInternetReachable, isRegistered} from '../reducers';
import {KEYCHAIN_STORAGE} from '../config.ts';
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
    handleDevice,
    deviceSuccess,
    deviceFailure,
    handleRefresh,
    refreshTokenSuccess,
    refreshTokenFailure,
    handleRevoke,
    revokeTokenSuccess,
    revokeTokenFailure,
} from '../actions/authenticationActions.ts';
import {handleLastPayment, handlePaymentList} from '../actions/homeActions.ts';

function* saveCredentials(login: string, stringify: IAuthorizeResult) {
    yield call([Keychain, Keychain.setGenericPassword], login, JSON.stringify(stringify), {storage: KEYCHAIN_STORAGE});
}

function* register({payload}: PayloadAction<ICredentials>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
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
                refreshToken: response.Token,
            };
            yield saveCredentials(username, stringify);
            yield put(authorizationSuccess(stringify));
            yield put(getUserSuccess(response));
            yield put(handleDevice());
        }
    } catch (error: any) {
        Sentry.captureException(error);
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
        const credentials: Keychain.UserCredentials | false = yield call([Keychain, Keychain.getGenericPassword], {storage: KEYCHAIN_STORAGE});
        if (credentials) {
            const token: string | null = yield call(getTokenFromKeychain, KEYCHAIN_TOKEN_KEY.accessToken);

            const login: {status: number, data: ILoginResponse} = yield call([loginApi, loginApi.get], '', {headers: {Authorization: `Basic ${token}`}});
            if (login.status === HttpStatusCode.Ok) {
                const response = login.data as ILoginResponse;
                const stringify = {
                    accessToken: token!,
                    refreshToken: response.Token,
                };
                //yield call([Keychain, Keychain.setGenericPassword], credentials.username, JSON.stringify(stringify), {storage: KEYCHAIN_STORAGE});
                yield saveCredentials(credentials.username, stringify);
                yield put(refreshTokenSuccess({refreshToken: response.Token}));
                yield put(getUserSuccess(response));
                //Reload the last call
                yield put({
                    type: payload.type,
                    payload: payload.payload,
                });
                yield put(handleDevice());
            }
        } else {
            yield put(refreshTokenFailure(new Errors(0, [], [payload.type + '|' + payload.payload])));
            yield put(logoutUser());
        }
    } catch (error: any) {
        Sentry.captureException(error);
        console.log(error);
        yield put(refreshTokenFailure(error));
        yield put(logoutUser());
    }
}

function* getDevice() {
    yield put(showLoadingIndicator());
    const state: TRootState = yield select();
    try {
        const device: {status: number, data: IDeviceResponse} = yield call([deviceApi, deviceApi.get], '', {headers: {Authorization: `Bearer ${state.authenticationReducer.refreshToken}`}});
        if (device.status === HttpStatusCode.Ok) {
            const response = device.data as IDeviceResponse;
            yield put(deviceSuccess(response));
            //Check User permission
            if (state.profileReducer.user.RoleId === 1) {
                //Get Payment List
                yield put(handlePaymentList());
            } else if (state.profileReducer.user.RoleId > 1) {
                //Get Last Payment
                yield put(handleLastPayment());
            }
        }
    } catch (error: any) {
        Sentry.captureException(error);
        console.log(error);
        yield put(deviceFailure(error));
    } finally {
        yield put(hideLoadingIndicator());
    }
}

function* revokeToken() {
    const isInternet: boolean | null = yield select(isInternetReachable);
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
    yield takeLeading(handleDevice, getDevice);
    yield takeLeading(handleRevoke, revokeToken);
    yield takeLeading(logoutUser, logout);
}
