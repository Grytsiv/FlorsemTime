import {combineReducers} from '@reduxjs/toolkit';
import appServiceReducer, {IAppServiceState} from './appServiceReducer';
import themeReducer, {IThemeState} from './themeReducer';
import authenticationReducer, {IAuthenticationState} from './authenticationReducer';
import profileReducer, {IProfileState} from './profileReducer';
import homeReducer, {IHomeState} from './homeReducer';

export interface IRootReducer {
    appServiceReducer: IAppServiceState,
    themeReducer: IThemeState,
    authenticationReducer: IAuthenticationState,
    profileReducer: IProfileState,
    homeReducer: IHomeState,
}

export const rootReducer = combineReducers({
    appServiceReducer,
    themeReducer,
    authenticationReducer,
    profileReducer,
    homeReducer,
});
