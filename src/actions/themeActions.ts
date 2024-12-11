import {createAction} from '@reduxjs/toolkit';
import {TOGGLE_THEME} from './types';

export const setIsDarkTheme = createAction<boolean>(TOGGLE_THEME);
