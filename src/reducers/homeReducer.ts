import createReducer from '../utils/createReducer';
import {
    GET_USERS_ME_SUCCESS,
    GET_USERS_ME_FAILURE,
    SHOW_HOME_ERROR,
    HIDE_HOME_ERROR,
} from '../actions/types';
import moment from 'moment/moment';
interface IHomeReducerState {
    licenseDate: Date;
    data: any
    error: any
    isShownErrorAlert: boolean
}
const initialState: IHomeReducerState = {
    licenseDate: new Date(moment(new Date()).add(1, 'month').toDate()),
    data: {},
    error: {},
    isShownErrorAlert: false,
};
const homeReducer = createReducer(
    {
        ...initialState,
    },
    {
        [GET_USERS_ME_SUCCESS](state: any, action: any) {
            return {
                ...state,
                ...action.payload,
                error: {},
            };
        },
        [GET_USERS_ME_FAILURE](state: any, action: any) {
            return {
                ...state,
                error: action.payload,
                isShownErrorAlert: true,
            };
        },
        [SHOW_HOME_ERROR](state: any, action: any) {
            return {
                ...state,
                error: action.payload,
                isShownErrorAlert: true,
            };
        },
        [HIDE_HOME_ERROR](state: any) {
            return {
                ...state,
                error: {},
                isShownErrorAlert: false,
            };
        },
    },
);
export default homeReducer;
