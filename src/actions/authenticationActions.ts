import {
    AUTHORIZATION_STATE_CHANGED,
    AUTHORIZE_REQUEST,
    USER_ALREADY_AUTHORIZED,
    REFRESH_TOKEN_REQUEST,
    REVOKE_TOKEN_REQUEST,
    HIDE_LOADING_INDICATOR,
} from './types';
import {IRefreshResult} from '../models/IRefreshResult.ts';

export const registrationHasBeenChanged = (registrationState: boolean) => ({
    type: AUTHORIZATION_STATE_CHANGED,
    payload: {registrationState},
});
export const handleAuthorize = (email: string = '1', password: string = '1') => ({
    type: AUTHORIZE_REQUEST,
    payload: {email, password},
});
export const userAlreadyAuthorized = (newAuthState: IRefreshResult) => ({
    type: USER_ALREADY_AUTHORIZED,
    payload: newAuthState,
});
export const handleRefresh = (type: string = HIDE_LOADING_INDICATOR, payload: string = '') => ({
    type: REFRESH_TOKEN_REQUEST,
    payload: {type, payload},
});
export const handleRevoke = () => ({
    type: REVOKE_TOKEN_REQUEST,
});
