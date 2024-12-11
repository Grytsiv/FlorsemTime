import {HIDE_LOADING_INDICATOR} from '../actions/types.ts';

export interface IRefreshResult {
    accessToken: string;
    login: string;
    refreshToken: string | null;
}
export interface IRefreshAction {
    type: string,
    payload: any
}
export class RefreshAction implements IRefreshAction {
    type: string;
    payload: any;

    constructor(type: string = HIDE_LOADING_INDICATOR, payload: any = null) {
        this.type = type;
        this.payload = payload;
    }
}
export interface IAuthorizeResult {
    accessToken: string;
    refreshToken: string;
}
