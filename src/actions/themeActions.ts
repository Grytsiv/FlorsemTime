import {TOGGLE_THEME} from './types';
export function setIsDarkTheme(value: boolean) {
    return {
        type: TOGGLE_THEME,
        isDark: value,
    };
}
