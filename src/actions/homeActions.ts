import {createAction} from '@reduxjs/toolkit';
import {
    CLEAR_LAST_PAYMENT,
    GET_LAST_PAYMENT_REQUEST,
    GET_LAST_PAYMENT_SUCCESS,
    GET_LAST_PAYMENT_FAILURE,
    RENEW_LICENSE_REQUEST,
    RENEW_LICENSE_SUCCESS,
    RENEW_LICENSE_FAILURE,
    GET_PAYMENT_LIST_REQUEST,
    GET_PAYMENT_LIST_SUCCESS,
    GET_PAYMENT_LIST_FAILURE,
    GET_ALL_COMPANIES_REQUEST,
    GET_ALL_COMPANIES_SUCCESS,
    GET_ALL_COMPANIES_FAILURE,
} from './types';
import {ICreateLicenseModel, ICreateLicenseResponse} from '../models/ICreateLicenseModel.ts';
import {ICompanyModel} from '../models/ICompanyModel.ts';
import {IErrors} from '../models/IErrorModel.ts';

export const clearLastPayment = createAction(CLEAR_LAST_PAYMENT);
export const handleLastPayment = createAction<number | undefined>(GET_LAST_PAYMENT_REQUEST);
export const lastPaymentSuccessResponse = createAction<ICreateLicenseResponse>(GET_LAST_PAYMENT_SUCCESS);
export const lastPaymentFailureResponse = createAction<IErrors>(GET_LAST_PAYMENT_FAILURE);
export const handleRenewLicense = createAction<ICreateLicenseModel>(RENEW_LICENSE_REQUEST);
export const renewLicenseSuccessResponse = createAction<ICreateLicenseResponse>(RENEW_LICENSE_SUCCESS);
export const renewLicenseFailureResponse = createAction<IErrors>(RENEW_LICENSE_FAILURE);
export const handlePaymentList = createAction(GET_PAYMENT_LIST_REQUEST);
export const paymentListSuccessResponse = createAction<ICreateLicenseResponse[]>(GET_PAYMENT_LIST_SUCCESS);
export const paymentListFailureResponse = createAction<IErrors>(GET_PAYMENT_LIST_FAILURE);
export const handleAllCompanies = createAction(GET_ALL_COMPANIES_REQUEST);
export const allCompaniesSuccessResponse = createAction<ICompanyModel[]>(GET_ALL_COMPANIES_SUCCESS);
export const allCompaniesFailureResponse = createAction<IErrors>(GET_ALL_COMPANIES_FAILURE);
