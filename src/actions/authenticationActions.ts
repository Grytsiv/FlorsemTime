import {createAction} from '@reduxjs/toolkit';
import {
    AUTHORIZE_REQUEST,
    USER_ALREADY_AUTHORIZED,
    REFRESH_TOKEN_REQUEST,
    REVOKE_TOKEN_REQUEST,
    AUTHORIZE_SUCCESS,
    REFRESH_TOKEN_SUCCESS,
} from './types';
import {IAuthorizeResult, IRefreshAction, IRefreshResult} from '../models/IRefreshResult.ts';
import {ICredentials} from '../models/ICredentials.ts';

export const handleAuthorize = createAction<ICredentials>(AUTHORIZE_REQUEST);
export const userAlreadyAuthorized = createAction<IRefreshResult>(USER_ALREADY_AUTHORIZED);
export const handleRefresh = createAction<IRefreshAction>(REFRESH_TOKEN_REQUEST);
export const handleRevoke = createAction(REVOKE_TOKEN_REQUEST);
export const authorizationSuccess = createAction<IAuthorizeResult>(AUTHORIZE_SUCCESS);
export const refreshTokenSuccess = createAction<{refreshToken: string}>(REFRESH_TOKEN_SUCCESS);
