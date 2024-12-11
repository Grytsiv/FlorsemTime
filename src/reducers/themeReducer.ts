import {createReducer} from '@reduxjs/toolkit';
import {setIsDarkTheme} from '../actions/themeActions.ts';

interface IThemeState {
    isDark: boolean;
}
const initialState: IThemeState = {
    isDark: false,
};

const themeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setIsDarkTheme, (state, action) => {
            state.isDark = action.payload;
        });
    },
);
export default themeReducer;
