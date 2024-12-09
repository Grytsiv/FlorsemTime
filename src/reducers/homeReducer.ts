import createReducer from '../utils/createReducer';
import {
    GET_LAST_PAYMENT_SUCCESS,
    RENEW_LICENSE_SUCCESS,
    SHOW_HOME_ERROR,
    HIDE_HOME_ERROR,
} from '../actions/types';
import moment from 'moment/moment';
import {ICreateLicenseResponse, LastLicenseModel} from '../models/ICreateLicenseModel.ts';

export interface IHomeState {
    licenseDate: Date;
    lastPayment: ICreateLicenseResponse,
    error: any
    isShownErrorAlert: boolean
}
const initialState: IHomeState = {
    licenseDate: new Date(moment(new Date()).add(1, 'month').toDate()),
    lastPayment: new LastLicenseModel(),
    error: {},
    isShownErrorAlert: false,
};
const homeReducer = createReducer(
    {
        ...initialState,
    },
    {
        [GET_LAST_PAYMENT_SUCCESS || RENEW_LICENSE_SUCCESS](state: any, action: any) {
            return {
                ...state,
                lastPayment: action.payload,
                isShownErrorAlert: false,
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
