import {createReducer} from '@reduxjs/toolkit';
import {authorizationSuccess, refreshTokenSuccess, userAlreadyAuthorized} from '../actions/authenticationActions.ts';

interface IAuthenticationState {
    accessToken: string;
    refreshToken: string;
}
const initialState: IAuthenticationState = {
    accessToken: '',
    refreshToken: '',
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
        })
        .addCase(refreshTokenSuccess,(state, action) => {
            state.refreshToken = action.payload.refreshToken;
        });
    }
);

export default authenticationReducer;
