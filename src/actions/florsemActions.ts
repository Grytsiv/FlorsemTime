import {createAction} from '@reduxjs/toolkit';
import {ICreateOldLicenseModel, ICreateOldLicenseResponse} from '../models/ICreateLicenseModel.ts';
import {RENEW_OLD_LICENSE_FAILURE, RENEW_OLD_LICENSE_REQUEST, RENEW_OLD_LICENSE_SUCCESS} from './types.ts';
import {IErrors} from '../models/IErrorModel.ts';

export const handleRenewOldLicense = createAction<ICreateOldLicenseModel>(RENEW_OLD_LICENSE_REQUEST);
export const renewOldLicenseSuccessResponse = createAction<ICreateOldLicenseResponse>(RENEW_OLD_LICENSE_SUCCESS);
export const renewOldLicenseFailureResponse = createAction<IErrors>(RENEW_OLD_LICENSE_FAILURE);
