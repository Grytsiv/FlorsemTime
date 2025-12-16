import {createAction} from '@reduxjs/toolkit';
import {
    AUTHORIZE_REQUEST,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_FAILURE,
    USER_ALREADY_AUTHORIZED,
    REFRESH_TOKEN_REQUEST,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,
    REVOKE_TOKEN_REQUEST,
    REVOKE_TOKEN_SUCCESS,
    REVOKE_TOKEN_FAILURE,
} from './types';
import {IAuthorizeResult, IRefreshAction, IRefreshResult} from '../models/IRefreshResult.ts';
import {ICredentials} from '../models/ICredentials.ts';
import {IErrors} from '../models/IErrorModel.ts';

export const handleAuthorize = createAction<ICredentials>(AUTHORIZE_REQUEST);
export const authorizationSuccess = createAction<IAuthorizeResult>(AUTHORIZE_SUCCESS);
export const authorizationFailure = createAction<IErrors>(AUTHORIZE_FAILURE);
export const userAlreadyAuthorized = createAction<IRefreshResult>(USER_ALREADY_AUTHORIZED);
export const handleRefresh = createAction<IRefreshAction>(REFRESH_TOKEN_REQUEST);
export const refreshTokenSuccess = createAction<{refreshToken: string}>(REFRESH_TOKEN_SUCCESS);
export const refreshTokenFailure = createAction<IErrors>(REFRESH_TOKEN_FAILURE);
export const handleRevoke = createAction(REVOKE_TOKEN_REQUEST);
export const revokeTokenSuccess = createAction(REVOKE_TOKEN_SUCCESS);
export const revokeTokenFailure = createAction<IErrors>(REVOKE_TOKEN_FAILURE);
