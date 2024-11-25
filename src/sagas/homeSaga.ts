import {put, call, takeEvery, select, delay} from 'redux-saga/effects';
import {
    SHOW_LOADING_INDICATOR,
    HIDE_LOADING_INDICATOR,
    GET_USERS_ME_REQUEST,
    GET_USERS_ME_SUCCESS,
    GET_USERS_ME_FAILURE,
    REFRESH_TOKEN_REQUEST,
    LOGOUT_USER,
} from '../actions/types';
import {TRootState} from '../boot/configureStore';
import {loginApi} from '../api/api';

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
        const apiResponse = response.data as any;
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
export default function* homeScreenFlow() {
    yield takeEvery(GET_USERS_ME_REQUEST, getUserInfo);
}
