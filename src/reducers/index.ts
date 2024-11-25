import {combineReducers} from '@reduxjs/toolkit';
import appServiceReducer from './appServiceReducer';
import themeReducer from './themeReducer';
import authenticationReducer from './authenticationReducer';
import homeReducer from './homeReducer';
export const rootReducer = combineReducers({
    appServiceReducer,
    themeReducer,
    authenticationReducer,
    homeReducer,
});
