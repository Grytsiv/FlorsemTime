import {put, call, takeEvery, takeLeading, select} from 'redux-saga/effects';
import {Buffer} from 'buffer';
import {PayloadAction} from '@reduxjs/toolkit';
import {
    AUTHORIZATION_STATE_CHANGED,
    NONE_INTERNET_CONNECTION,
    SHOW_LOADING_INDICATOR,
    HIDE_LOADING_INDICATOR,
    AUTHORIZE_REQUEST,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_FAILURE,
    REFRESH_TOKEN_REQUEST,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,
    REVOKE_TOKEN_REQUEST,
    REVOKE_TOKEN_SUCCESS,
    REVOKE_TOKEN_FAILURE,
    LOGOUT_USER,
    GET_USERS_ME_SUCCESS,
} from '../actions/types';
import * as Keychain from 'react-native-keychain';
import {getTokenFromKeychain} from '../utils/keychainStorage.ts';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage.ts';
import {loginApi, logoutApi} from '../api/api.ts';
import {ILoginResponse} from '../models/ILoginResponse.ts';
import {ICredentials} from '../models/ICredentials.ts';
import {IAuthorizeResult, IRefreshAction} from '../models/IRefreshResult.ts';
import {isInternetReachable} from '../reducers';

function* register({payload}: PayloadAction<ICredentials>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put({type: SHOW_LOADING_INDICATOR});
        try {
            const token = Buffer.from(`${payload.login}:${payload.password}`).toString('base64');
            const username: string = payload.login;
            let stringify: IAuthorizeResult = {
                accessToken: token,
                refreshToken: '',
            };
            yield call([Keychain, Keychain.setGenericPassword], username, JSON.stringify(stringify));
            // @ts-ignore
            const login: any = yield call(loginApi);
            const response = login.data as ILoginResponse;
            //console.log('response', response.Token);
            stringify = {
                accessToken: token,
                refreshToken: response.Token,
            };
            yield call([Keychain, Keychain.setGenericPassword], username, JSON.stringify(stringify));
            yield put({
                type: AUTHORIZE_SUCCESS,
                payload: {...stringify},
            });
        } catch (error: any) {
            console.log(error);
            yield put({
                type: AUTHORIZE_FAILURE,
                payload: {...error},
            });
            yield put({
                type: AUTHORIZATION_STATE_CHANGED,
                payload: {
                    registrationState: false,
                },
            });
        } finally {
            yield put({type: HIDE_LOADING_INDICATOR});
        }
    } else {
        yield put({type: NONE_INTERNET_CONNECTION});
    }
}

function* refreshToken({payload}: PayloadAction<IRefreshAction>) {
    try {
        // @ts-ignore
        const credentials = yield call([Keychain, Keychain.getGenericPassword]);
        //console.log(credentials);
        // @ts-ignore
        const token = yield call(getTokenFromKeychain, KEYCHAIN_TOKEN_KEY.accessToken);
        //console.log('token', token);
        // @ts-ignore
        const login: any = yield call(loginApi);
        const response = login.data as ILoginResponse;
        const stringify = {
            accessToken: token,
            refreshToken: response.Token,
        };
        yield call([Keychain, Keychain.setGenericPassword], credentials.username, JSON.stringify(stringify));
        yield put({
            type: REFRESH_TOKEN_SUCCESS,
            payload: {
                refreshToken: response.Token,
            },
        });
        yield put({
            type: GET_USERS_ME_SUCCESS,
            payload: {...response},
        });
        //Reload the last call
        yield put({
            type: payload.type,
            payload: payload.payload,
        });
    } catch (error: any) {
        console.log(error);
        yield put({
            type: REFRESH_TOKEN_FAILURE,
            payload: {...error},
        });
        yield put({type: LOGOUT_USER});
    }
}

function* revokeToken() {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put({type: SHOW_LOADING_INDICATOR});
        try {
            // @ts-ignore
            yield call(logoutApi);
            yield put({type: LOGOUT_USER});
            yield put({type: REVOKE_TOKEN_SUCCESS});
        } catch (error: any) {
            if (error.status === 401) {
                //Refresh Token, and then call this request again
                yield put({
                    type: REFRESH_TOKEN_REQUEST,
                    payload: {type: REVOKE_TOKEN_REQUEST, payload: null},
                });
                return;
            }
            console.log(error);
            yield put({
                type: REVOKE_TOKEN_FAILURE,
                payload: {...error},
            });
        } finally {
            yield put({type: HIDE_LOADING_INDICATOR});
        }
    } else {
        yield put({type: NONE_INTERNET_CONNECTION});
    }
}
function* logout() {
    yield call([Keychain, Keychain.resetGenericPassword]);
}

export default function* authorizeFlow() {
    yield takeLeading(AUTHORIZE_REQUEST, register);
    yield takeLeading(REFRESH_TOKEN_REQUEST, refreshToken);
    yield takeLeading(REVOKE_TOKEN_REQUEST, revokeToken);
    yield takeEvery(LOGOUT_USER, logout);
}
