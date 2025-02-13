import {createReducer} from '@reduxjs/toolkit';
import {authorizationSuccess, refreshTokenSuccess, userAlreadyAuthorized} from '../actions/authenticationActions.ts';
import {logoutUser} from '../actions/appServiceActions.ts';

interface IAuthenticationState {
    accessToken: string;
    refreshToken: string;
    login: string;
}
const initialState: IAuthenticationState = {
    accessToken: '',
    refreshToken: '',
    login: '',
};
const authenticationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(authorizationSuccess,(state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        })
        .addCase(userAlreadyAuthorized,(state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken!;
            state.login = action.payload.login;
        })
        .addCase(refreshTokenSuccess,(state, action) => {
            state.refreshToken = action.payload.refreshToken;
        })
        .addCase(logoutUser, (state) => {
            state.accessToken = '';
            state.refreshToken = '';
        });
    }
);

export default authenticationReducer;
