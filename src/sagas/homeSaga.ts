import {put, call, select, delay, takeLeading} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {
    SHOW_LOADING_INDICATOR,
    HIDE_LOADING_INDICATOR,
    GET_USERS_ME_REQUEST,
    GET_USERS_ME_SUCCESS,
    GET_USERS_ME_FAILURE,
    GET_LAST_PAYMENT_REQUEST,
    GET_LAST_PAYMENT_SUCCESS,
    GET_LAST_PAYMENT_FAILURE,
    REFRESH_TOKEN_REQUEST,
    LOGOUT_USER,
    NONE_INTERNET_CONNECTION,
    RENEW_LICENSE_REQUEST,
    RENEW_LICENSE_SUCCESS,
    RENEW_LICENSE_FAILURE,
} from '../actions/types';
import {TRootState} from '../boot/configureStore';
import {loginApi, createLicenceApi, lastPaymentApi} from '../api/api';
import {ICreateLicenseModel, ICreateLicenseResponse} from '../models/ICreateLicenseModel';
import {ILoginResponse} from '../models/ILoginResponse';
import {isInternetReachable} from '../reducers';

function* getUserInfo() {
    let state: TRootState = yield select();
    // show a loader
    yield put({type: SHOW_LOADING_INDICATOR});
    //wait for a stable internet connection
    while (
        state.appServiceReducer.netInfoState.isInternetReachable === null ||
        state.appServiceReducer.netInfoState.isInternetReachable === undefined
        ) {
        yield delay(100);
        state = yield select();
    }
    try {
        // @ts-ignore
        const response = yield call(loginApi);
        const apiResponse = response.data as ILoginResponse;
        yield put({
            type: GET_USERS_ME_SUCCESS,
            payload: {...apiResponse},
        });
    } catch (error: any) {
        if (error.status === 401) {
            //Refresh Token, and then call this request again
            yield put({
                type: REFRESH_TOKEN_REQUEST,
                payload: {type: GET_USERS_ME_REQUEST, payload: null},
            });
            return;
        }
        yield put({
            type: GET_USERS_ME_FAILURE,
            payload: {...error},
        });
        yield put({type: LOGOUT_USER});
    }
    yield put({type: HIDE_LOADING_INDICATOR});
}

function* getLastPayment() {
    let state: TRootState = yield select();
    // show a loader
    yield put({type: SHOW_LOADING_INDICATOR});
    //wait for a stable internet connection
    while (
        state.appServiceReducer.netInfoState.isInternetReachable === null ||
        state.appServiceReducer.netInfoState.isInternetReachable === undefined
        ) {
        yield delay(100);
        state = yield select();
    }
    try {
        // @ts-ignore
        const response = yield call(lastPaymentApi);
        const apiResponse = response.data as ICreateLicenseResponse;
        yield put({
            type: GET_LAST_PAYMENT_SUCCESS,
            payload: {...apiResponse},
        });
    } catch (error: any) {
        if (error.status === 401) {
            //Refresh Token, and then call this request again
            yield put({
                type: REFRESH_TOKEN_REQUEST,
                payload: {type: GET_LAST_PAYMENT_REQUEST, payload: null},
            });
            return;
        }
        yield put({
            type: GET_LAST_PAYMENT_FAILURE,
            payload: {...error},
        });
        yield put({type: LOGOUT_USER});
    }

    //In case if no user profile exists, call user profile
    state = yield select();
    if (state.profileReducer.user.LastActivityTime === '') {
        yield put({type: GET_USERS_ME_REQUEST});
    }

    yield put({type: HIDE_LOADING_INDICATOR});
}

function* renewLicense({payload, type}: PayloadAction<ICreateLicenseModel>) {
    const isInternet: boolean | null = yield select(isInternetReachable);
    if (isInternet) {
        // show a loader
        yield put({type: SHOW_LOADING_INDICATOR});
        try {
            // @ts-ignore
            const newLicense: any = yield call(createLicenceApi, payload);
            const response = newLicense.data as ICreateLicenseResponse;
            //console.log('response', response);
            yield put({
                type: RENEW_LICENSE_SUCCESS,
                payload: {...response},
            });
        } catch (error: any) {
            console.log(error);
            if (error.status === 401) {
                //Refresh Token, and then call this request again
                yield put({
                    type: REFRESH_TOKEN_REQUEST,
                    payload: {type, payload},
                });
                return;
            }
            yield put({
                type: RENEW_LICENSE_FAILURE,
                payload: {...error},
            });
        } finally {
            yield put({type: HIDE_LOADING_INDICATOR});
        }
    } else {
        yield put({type: NONE_INTERNET_CONNECTION});
    }
}

export default function* homeScreenFlow() {
    yield takeLeading(GET_USERS_ME_REQUEST, getUserInfo);
    yield takeLeading(GET_LAST_PAYMENT_REQUEST, getLastPayment);
    yield takeLeading(RENEW_LICENSE_REQUEST, renewLicense);
}
