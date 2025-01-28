import {createAction} from '@reduxjs/toolkit';
import {
    CONNECTION_CHANGED,
    APP_STATE_CHANGED,
    AUTHORIZATION_STATE_CHANGED,
    SHOW_LOADING_INDICATOR,
    HIDE_LOADING_INDICATOR,
    NONE_INTERNET_CONNECTION,
    SHOW_ERROR,
    HIDE_ERROR,
    LOGOUT_USER,
} from './types';
import {INetInfo} from '../models/netInfoModel.ts';

export const connectionHasBeenChanged = createAction<INetInfo>(CONNECTION_CHANGED);
export const appStateChanged = createAction<string>(APP_STATE_CHANGED);
export const authStateChanged = createAction<boolean>(AUTHORIZATION_STATE_CHANGED);
export const showLoadingIndicator = createAction(SHOW_LOADING_INDICATOR);
export const hideLoadingIndicator = createAction(HIDE_LOADING_INDICATOR);
export const noneInternetConnection = createAction(NONE_INTERNET_CONNECTION);
export const showErrorAlert = createAction(SHOW_ERROR);
export const hideErrorAlert = createAction(HIDE_ERROR);
export const logoutUser = createAction(LOGOUT_USER);
