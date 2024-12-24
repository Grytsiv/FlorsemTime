import {createReducer} from '@reduxjs/toolkit';
import {getDeviceSuccess, getUserSuccess} from '../actions/profileActions.ts';
import {ILoginResponse, User} from '../models/ILoginResponse.ts';
import {DeviceResponse, IDeviceResponse} from '../models/IDeviceResponse.ts';

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
        .addCase(getDeviceSuccess, (state, action) => {
            state.device = action.payload;
        });
    },
);

export default profileReducer;
