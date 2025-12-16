import {createReducer} from '@reduxjs/toolkit';
import {getUserSuccess} from '../actions/profileActions.ts';
import {ILoginResponse, User} from '../models/ILoginResponse.ts';
import {logoutUser} from '../actions/appServiceActions.ts';

interface IProfileState {
    user: ILoginResponse;
}
const initialState: IProfileState = {
    user: new User(),
};

const profileReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getUserSuccess, (state, action) => {
            state.user = action.payload;
        })
        .addCase(logoutUser, (state) => {
            state.user = initialState.user;
        });
    },
);

export default profileReducer;
