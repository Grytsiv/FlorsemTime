import {createAction} from '@reduxjs/toolkit';
import {GET_DEVICE_SUCCESS, GET_USERS_ME_SUCCESS} from './types.ts';
import {ILoginResponse} from '../models/ILoginResponse.ts';
import {IDeviceResponse} from '../models/IDeviceResponse.ts';

export const getUserSuccess = createAction<ILoginResponse>(GET_USERS_ME_SUCCESS);
export const getDeviceSuccess = createAction<IDeviceResponse>(GET_DEVICE_SUCCESS);
