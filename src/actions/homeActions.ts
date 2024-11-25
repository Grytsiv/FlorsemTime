import {RENEW_LICENSE_REQUEST} from './types';
import {ICreateLicenseModel} from '../models/ICreateLicenseModel.ts';

export const handleRenewLicense = (license: ICreateLicenseModel) => ({
    type: RENEW_LICENSE_REQUEST,
    payload: {license},
});
