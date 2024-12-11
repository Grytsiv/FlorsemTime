import {createAction} from '@reduxjs/toolkit';
import {GET_USERS_ME_SUCCESS} from './types.ts';
import {ILoginResponse} from '../models/ILoginResponse.ts';

export const getUserSuccess = createAction<ILoginResponse>(GET_USERS_ME_SUCCESS);
