import {combineReducers} from '@reduxjs/toolkit';
import appServiceReducer from './appServiceReducer';
import authenticationReducer from './authenticationReducer';
import homeReducer from './homeReducer';
import florsemReducer from './florsemReducer.ts';
import profileReducer from './profileReducer';
import themeReducer from './themeReducer';
import {TRootState} from '../boot/configureStore.ts';

export const rootReducer = combineReducers({
    appServiceReducer,
    authenticationReducer,
    homeReducer,
    florsemReducer,
    profileReducer,
    themeReducer,
});

export const isInternetReachable = (state: TRootState) => state.appServiceReducer.netInfoState.isInternetReachable;
export const isRegistered  = (state: TRootState) => state.appServiceReducer.isRegistered;
