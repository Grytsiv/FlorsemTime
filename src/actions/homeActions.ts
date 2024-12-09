import {GET_LAST_PAYMENT_REQUEST, GET_USERS_ME_REQUEST, RENEW_LICENSE_REQUEST} from './types';
import {ICreateLicenseModel} from '../models/ICreateLicenseModel.ts';

export const handleRenewLicense = (license: ICreateLicenseModel) => ({
    type: RENEW_LICENSE_REQUEST,
    payload: {license},
});
export const handleLastPayment = () => ({
    type: GET_LAST_PAYMENT_REQUEST,
});
export const handleUserMe = () => ({
   type: GET_USERS_ME_REQUEST,
});
