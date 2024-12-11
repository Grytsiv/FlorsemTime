import {createAction} from '@reduxjs/toolkit';
import {
    GET_LAST_PAYMENT_REQUEST,
    RENEW_LICENSE_REQUEST,
    GET_LAST_PAYMENT_SUCCESS,
    RENEW_LICENSE_SUCCESS,
} from './types';
import {ICreateLicenseModel, ICreateLicenseResponse} from '../models/ICreateLicenseModel.ts';

export const handleRenewLicense = createAction<ICreateLicenseModel>(RENEW_LICENSE_REQUEST);
export const handleLastPayment = createAction(GET_LAST_PAYMENT_REQUEST);
export const lastPaymentSuccessResponse = createAction<ICreateLicenseResponse>(GET_LAST_PAYMENT_SUCCESS);
export const renewLicenseSuccessResponse = createAction<ICreateLicenseResponse>(RENEW_LICENSE_SUCCESS);
