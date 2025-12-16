import {createReducer} from '@reduxjs/toolkit';
import {
    paymentListSuccessResponse,
} from '../actions/homeActions.ts';
import {
  ICompanyResponse,
} from '../models/ICreateLicenseModel.ts';
import {logoutUser} from '../actions/appServiceActions.ts';

interface IHomeState {
    paymentList: ICompanyResponse[],
}
const initialState: IHomeState = {
    paymentList: [],
};
const homeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(paymentListSuccessResponse, (state, action) => {
            state.paymentList = action.payload;
        })
        .addCase(logoutUser, (state) => {
            state.paymentList = initialState.paymentList;
        });
    },
);

export default homeReducer;
