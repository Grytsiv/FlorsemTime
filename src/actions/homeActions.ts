import {createAction} from '@reduxjs/toolkit';
import {
    RENEW_KHYMCOR_LICENSE_REQUEST,
    RENEW_KHYMCOR_LICENSE_SUCCESS,
    RENEW_KHYMCOR_LICENSE_FAILURE,
    GET_PAYMENT_LIST_REQUEST,
    GET_PAYMENT_LIST_SUCCESS,
    GET_PAYMENT_LIST_FAILURE,
} from './types';
import {
  ICompanyResponse,
  ICreateKhymcorLicenseModel,
  ICreateKhymcorLicenseResponse,
} from '../models/ICreateLicenseModel.ts';
import {IErrors} from '../models/IErrorModel.ts';

export const handleRenewKhymcorLicense = createAction<ICreateKhymcorLicenseModel>(RENEW_KHYMCOR_LICENSE_REQUEST);
export const renewLicenseSuccessResponse = createAction<ICreateKhymcorLicenseResponse>(RENEW_KHYMCOR_LICENSE_SUCCESS);
export const renewLicenseFailureResponse = createAction<IErrors>(RENEW_KHYMCOR_LICENSE_FAILURE);
export const handlePaymentList = createAction(GET_PAYMENT_LIST_REQUEST);
export const paymentListSuccessResponse = createAction<ICompanyResponse[]>(GET_PAYMENT_LIST_SUCCESS);
export const paymentListFailureResponse = createAction<IErrors>(GET_PAYMENT_LIST_FAILURE);
