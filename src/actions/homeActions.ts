import {createAction} from '@reduxjs/toolkit';
import {
    CLEAR_LAST_PAYMENT,
    GET_LAST_PAYMENT_REQUEST,
    GET_LAST_PAYMENT_SUCCESS,
    GET_LAST_PAYMENT_FAILURE,
    RENEW_KHYMKOR_LICENSE_REQUEST,
    RENEW_KHYMKOR_LICENSE_SUCCESS,
    RENEW_KHYMKOR_LICENSE_FAILURE,
    GET_PAYMENT_LIST_REQUEST,
    GET_PAYMENT_LIST_SUCCESS,
    GET_PAYMENT_LIST_FAILURE,
} from './types';
import {
  ICompanyResponse,
  ICreateKhymkorLicenseModel,
  ICreateKhymkorLicenseResponse,
  ICreateLicenseResponse,
} from '../models/ICreateLicenseModel.ts';
import {IErrors} from '../models/IErrorModel.ts';

export const clearLastPayment = createAction(CLEAR_LAST_PAYMENT);
export const handleLastPayment = createAction<number | undefined>(GET_LAST_PAYMENT_REQUEST);
export const lastPaymentSuccessResponse = createAction<ICreateLicenseResponse>(GET_LAST_PAYMENT_SUCCESS);
export const lastPaymentFailureResponse = createAction<IErrors>(GET_LAST_PAYMENT_FAILURE);
export const handleRenewKhymkorLicense = createAction<ICreateKhymkorLicenseModel>(RENEW_KHYMKOR_LICENSE_REQUEST);
export const renewLicenseSuccessResponse = createAction<ICreateKhymkorLicenseResponse>(RENEW_KHYMKOR_LICENSE_SUCCESS);
export const renewLicenseFailureResponse = createAction<IErrors>(RENEW_KHYMKOR_LICENSE_FAILURE);
export const handlePaymentList = createAction(GET_PAYMENT_LIST_REQUEST);
export const paymentListSuccessResponse = createAction<ICompanyResponse[]>(GET_PAYMENT_LIST_SUCCESS);
export const paymentListFailureResponse = createAction<IErrors>(GET_PAYMENT_LIST_FAILURE);
