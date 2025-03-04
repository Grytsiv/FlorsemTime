import moment from 'moment/moment';
import {createReducer, isAnyOf} from '@reduxjs/toolkit';
import {ICreateOldLicenseResponse, LastOldLicenseModel} from '../models/ICreateLicenseModel.ts';
import {logoutUser} from '../actions/appServiceActions.ts';
import {renewOldLicenseSuccessResponse} from '../actions/florsemActions.ts';

interface IHomeState {
    licenseDate: Date;
    lastPayment: ICreateOldLicenseResponse,
}
const initialState: IHomeState = {
    licenseDate: new Date(moment(new Date()).add(1, 'month').toDate()),
    lastPayment: new LastOldLicenseModel(),
};
const florsemReducer = createReducer(initialState, (builder) => {
        builder
            .addCase(logoutUser, (state) => {
                state.licenseDate = initialState.licenseDate;
                state.lastPayment = initialState.lastPayment;
            })
            .addMatcher(
                isAnyOf(
                    renewOldLicenseSuccessResponse
                ),
                (state, action) => {
                    state.lastPayment = action.payload;
                });
    },
);

export default florsemReducer;
