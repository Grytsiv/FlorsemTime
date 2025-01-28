import {createReducer} from '@reduxjs/toolkit';
import {getUserSuccess} from '../actions/profileActions.ts';
import {ILoginResponse, User} from '../models/ILoginResponse.ts';
import {DeviceResponse, IDeviceResponse} from '../models/IDeviceResponse.ts';
import {logoutUser} from '../actions/appServiceActions.ts';
import {deviceSuccess} from '../actions/authenticationActions.ts';

interface IProfileState {
    user: ILoginResponse;
    device: IDeviceResponse;
}
const initialState: IProfileState = {
    user: new User(),
    device: new DeviceResponse(),
};

const profileReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getUserSuccess, (state, action) => {
            state.user = action.payload;
        })
        .addCase(deviceSuccess, (state, action) => {
            state.device = action.payload;
        })
        .addCase(logoutUser, (state) => {
            state.user = initialState.user;
            state.device = initialState.device;
        });
    },
);

export default profileReducer;
