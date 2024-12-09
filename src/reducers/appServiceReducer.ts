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
export interface IAppServiceState {
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
        [SHOW_LOADING_INDICATOR](state: IAppServiceState) {
            return {
                ...state,
                isBusy: true,
            };
        },
        [HIDE_LOADING_INDICATOR](state: IAppServiceState) {
            return {
                ...state,
                isBusy: false,
            };
        },
        [AUTHORIZATION_STATE_CHANGED](state: IAppServiceState, action: any) {
            return {
                ...state,
                isRegistered: action.payload.registrationState,
            };
        },
        [AUTHORIZE_SUCCESS](state: IAppServiceState) {
            return {
                ...state,
                isRegistered: true,
            };
        },
        [LOGOUT_USER](state: IAppServiceState) {
            return {
                ...state,
                isRegistered: false,
            };
        },
        [USER_ALREADY_AUTHORIZED](state: IAppServiceState) {
            return {
                ...state,
                isRegistered: true,
            };
        },
        [CONNECTION_CHANGED](state: IAppServiceState, action: any) {
            return {
                ...state,
                netInfoState: action.payload.netInfoState,
            };
        },
        [APP_STATE_CHANGED](state: IAppServiceState, action: any) {
            return {
                ...state,
                appState: action.payload.appState,
            };
        },
    },
);
export default appServiceReducer;
