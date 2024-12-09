import createReducer from '../utils/createReducer';
import {
    AUTHORIZE_SUCCESS,
    USER_ALREADY_AUTHORIZED,
    REFRESH_TOKEN_SUCCESS,
} from '../actions/types';

export interface IAuthenticationState {
    accessToken: string;
    refreshToken: string;
}
const initialState: IAuthenticationState = {
    accessToken: '',
    refreshToken: '',
};
const authenticationReducer = createReducer(
    {
        ...initialState,
    },
    {
        [AUTHORIZE_SUCCESS](state: any, action: any) {
            return {
                ...state,
                ...action.payload,
                error: {},
            };
        },
        [USER_ALREADY_AUTHORIZED](state: any, action: any) {
            return {
                ...state,
                ...action.payload,
                error: {},
            };
        },
        [REFRESH_TOKEN_SUCCESS](state: any, action: any) {
            return {
                ...state,
                ...action.payload,
                error: {},
            };
        },
    },
);
export default authenticationReducer;
