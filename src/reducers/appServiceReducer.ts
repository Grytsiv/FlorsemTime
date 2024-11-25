import createReducer from '../utils/createReducer';
import {
    SHOW_LOADING_INDICATOR,
    HIDE_LOADING_INDICATOR,
    AUTHORIZATION_STATE_CHANGED,
    AUTHORIZE_SUCCESS,
    LOGOUT_USER,
    USER_ALREADY_AUTHORIZED,
    CONNECTION_CHANGED,
    APP_STATE_CHANGED,
} from '../actions/types';
import {NetInfoStateType} from '@react-native-community/netinfo';
interface IAppServiceState {
    isBusy: boolean;
    isRegistered: undefined | boolean;
    appState: 'none' | 'active' | 'background' | 'inactive';
    netInfoState: {
        details: any | null;
        isConnected: boolean;
        isInternetReachable: boolean | null;
        type: NetInfoStateType;
    };
}
const initialState: IAppServiceState = {
    isBusy: false,
    isRegistered: undefined,
    appState: 'none',
    netInfoState: {
        details: {},
        isConnected: false,
        isInternetReachable: false,
        type: NetInfoStateType.unknown,
    },
};
const appServiceReducer = createReducer(
    {...initialState},
    {
        [SHOW_LOADING_INDICATOR](state: any) {
            return {
                ...state,
                isBusy: true,
            };
        },
        [HIDE_LOADING_INDICATOR](state: any) {
            return {
                ...state,
                isBusy: false,
            };
        },
        [AUTHORIZATION_STATE_CHANGED](state: any, action: any) {
            return {
                ...state,
                isRegistered: action.payload.registrationState,
            };
        },
        [AUTHORIZE_SUCCESS](state: any) {
            return {
                ...state,
                isRegistered: true,
            };
        },
        [LOGOUT_USER](state: any) {
            return {
                ...state,
                isRegistered: false,
            };
        },
        [USER_ALREADY_AUTHORIZED](state: any) {
            return {
                ...state,
                isRegistered: true,
            };
        },
        [CONNECTION_CHANGED](state: any, action: any) {
            return {
                ...state,
                ...action.payload,
            };
        },
        [APP_STATE_CHANGED](state: any, action: any) {
            return {
                ...state,
                appState: action.payload.appState,
            };
        },
    },
);
export default appServiceReducer;
