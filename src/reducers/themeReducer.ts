import createReducer from '../utils/createReducer';
import {TOGGLE_THEME} from '../actions/types';

export interface IThemeState {
    isDark: boolean;
}
const initialState: IThemeState = {
    isDark: false,
};
const themeReducer = createReducer(
    {...initialState},
    {
        [TOGGLE_THEME](state: any, action: any) {
            return {
                ...state,
                isDark: action.isDark,
            };
        },
    },
);
export default themeReducer;
