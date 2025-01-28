import moment from 'moment/moment';
import {createReducer, isAnyOf} from '@reduxjs/toolkit';
import {
    clearLastPayment,
    allCompaniesSuccessResponse,
    lastPaymentSuccessResponse,
    paymentListSuccessResponse,
    renewLicenseSuccessResponse,
} from '../actions/homeActions.ts';
import {ICreateLicenseResponse, LastLicenseModel} from '../models/ICreateLicenseModel.ts';
import {ICompanyModel} from '../models/ICompanyModel.ts';
import {logoutUser} from '../actions/appServiceActions.ts';

interface IHomeState {
    licenseDate: Date;
    lastPayment: ICreateLicenseResponse,
    paymentList: ICreateLicenseResponse[]
    allCompanies: ICompanyModel[]
}
const initialState: IHomeState = {
    licenseDate: new Date(moment(new Date()).add(1, 'month').toDate()),
    lastPayment: new LastLicenseModel(),
    paymentList: [],
    allCompanies: [],
};
const homeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(paymentListSuccessResponse, (state, action) => {
            state.paymentList = action.payload;
        })
        .addCase(allCompaniesSuccessResponse, (state, action) => {
            state.allCompanies = action.payload;
        })
        .addCase(clearLastPayment, (state) => {
            state.lastPayment = new LastLicenseModel();
        })
        .addCase(logoutUser, (state) => {
            state.licenseDate = initialState.licenseDate;
            state.lastPayment = initialState.lastPayment;
            state.paymentList = initialState.paymentList;
            state.allCompanies = initialState.allCompanies;
        })
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
