import {createReducer} from '@reduxjs/toolkit';
import {
    showLoadingIndicator,
    hideLoadingIndicator,
    authStateChanged,
    connectionHasBeenChanged,
    appStateChanged,
    showErrorAlert,
    hideErrorAlert,
    logoutUser,
} from '../actions/appServiceActions.ts';
import {authorizationSuccess, userAlreadyAuthorized} from '../actions/authenticationActions.ts';
import {INetInfo, NetInfoClass} from '../models/netInfoModel.ts';

interface IAppServiceState {
    isBusy: boolean;
    isRegistered: undefined | boolean;
    appState: string;
    netInfoState: INetInfo;
    error: any;
    isShownErrorAlert: boolean;
}
const initialState: IAppServiceState = {
    isBusy: false,
    isRegistered: undefined,
    appState: 'none',
    netInfoState: new NetInfoClass(),
    error: {},
    isShownErrorAlert: false,
};

const appServiceReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(showLoadingIndicator, (state) => {
           state.isBusy = true;
        })
        .addCase(hideLoadingIndicator, (state) => {
            state.isBusy = false;
        })
        .addCase(authStateChanged, (state, action) => {
            state.isRegistered = action.payload;
        })
        .addCase(authorizationSuccess, (state) => {
            state.isRegistered = true;
        })
        .addCase(logoutUser, (state) => {
            state.isRegistered = false;
        })
        .addCase(userAlreadyAuthorized, (state) => {
            state.isRegistered = true;
        })
        .addCase(connectionHasBeenChanged, (state, action) => {
            state.netInfoState = action.payload;
        })
        .addCase(appStateChanged, (state, action) => {
            state.appState = action.payload;
        })
        .addCase(showErrorAlert, (state) => {
            state.isShownErrorAlert = true;
        })
        .addCase(hideErrorAlert, (state) => {
            state.isShownErrorAlert = false;
        });
    }
);

export default appServiceReducer;
