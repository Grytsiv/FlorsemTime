import {combineReducers} from '@reduxjs/toolkit';
import appServiceReducer from './appServiceReducer';
import authenticationReducer from './authenticationReducer';
import homeReducer from './homeReducer';
import profileReducer from './profileReducer';
import themeReducer from './themeReducer';

export const rootReducer = combineReducers({
    appServiceReducer,
    authenticationReducer,
    homeReducer,
    profileReducer,
    themeReducer,
});
