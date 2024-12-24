import moment from 'moment/moment';
import {createReducer, isAnyOf} from '@reduxjs/toolkit';
import {lastPaymentSuccessResponse, renewLicenseSuccessResponse} from '../actions/homeActions.ts';
import {ICreateLicenseResponse, LastLicenseModel} from '../models/ICreateLicenseModel.ts';

interface IHomeState {
    licenseDate: Date;
    lastPayment: ICreateLicenseResponse,
}
const initialState: IHomeState = {
    licenseDate: new Date(moment(new Date()).add(1, 'month').toDate()),
    lastPayment: new LastLicenseModel(),
};
const homeReducer = createReducer(initialState, (builder) => {
    builder
        .addMatcher(
            isAnyOf(
                lastPaymentSuccessResponse,
                renewLicenseSuccessResponse
            ),
            (state, action) => {
            state.lastPayment = action.payload;
        });
    },
);

export default homeReducer;
