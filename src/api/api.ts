import {Platform} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import DeviceInfo from 'react-native-device-info';
import {
    SERVER_URL,
    LOGIN_API,
    LOGOUT_API,
    LICENSE_API,
    GET_LAST_PAYMENT_API,
    DEFAULT_TIME_OUT,
    DEVICE_API,
    REAL_SCREEN_WIDTH,
    REAL_SCREEN_HEIGHT,
    GET_PAYMENT_LIST_API,
    GET_ALL_COMPANYS_API,
} from '../config';
import {getTokenFromKeychain} from '../utils/keychainStorage';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage';
import {ICreateLicenseModel} from '../models/ICreateLicenseModel.ts';
import {CreateDeviceModel} from '../models/ICreateDeviceModel.ts';
import i18n from '../i18n.ts';

function newAbortSignal(timeout: number) {
    const abortController = new AbortController();
    type Timer = ReturnType<typeof setTimeout>;
    const timer: Timer =  setTimeout(() => abortController.abort(), timeout || 0);
    clearTimeout(timer);
    return abortController.signal;
}

const createApiInstance = (baseURL: string) => {
    //console.log('baseURL', baseURL);
    const instance = axios.create({
        signal: newAbortSignal(Number(DEFAULT_TIME_OUT)),
        timeout: Number(DEFAULT_TIME_OUT),
        baseURL,
        //params: params !== undefined ? params : undefined,
    });

    let cancelTokenSource = axios.CancelToken.source();

    instance.interceptors.request.use(async req => {
        // Set the cancel token for the request
        req.cancelToken = cancelTokenSource.token;
        const uniqueId = await DeviceInfo.getUniqueId();
        if (req.headers) {
            req.headers['Content-Type'] = 'application/json';
            if (baseURL.endsWith(LOGIN_API)) {
                const accessToken = await getTokenFromKeychain(KEYCHAIN_TOKEN_KEY.accessToken);
                if (accessToken) {
                    console.log('api accessToken:', accessToken);
                    req.headers.Authorization = `Basic ${accessToken}`;
                    req.headers.uniqueId = uniqueId;
                } else {
                    console.error('No accessToken found');
                    cancelTokenSource.cancel('Request canceled due to lack of access token');
                }
            } else {
                const refreshToken = await getTokenFromKeychain(KEYCHAIN_TOKEN_KEY.refreshToken);
                if (refreshToken) {
                    console.log('api refreshToken:', refreshToken);
                    req.headers.Authorization = `Bearer ${refreshToken}`;
                    const idiom = DeviceInfo.isTablet() ? 'Tablet' : 'Phone';
                    const name = await DeviceInfo.getDeviceName();
                    const model = DeviceInfo.getModel();
                    const versionString = DeviceInfo.getSystemName() + '(' + DeviceInfo.getSystemVersion() + ')';
                    const versionName = DeviceInfo.getVersion();
                    const versionCode = DeviceInfo.getBuildNumber();
                    const bundleId = DeviceInfo.getBundleId();
                    const deviceType = await DeviceInfo.isEmulator() ? 'Virtual' : 'Physical';
                    const manufacturer = await DeviceInfo.getManufacturer();
                    const description = await DeviceInfo.getUserAgent();
                    const computerName = await DeviceInfo.getHost();
                    const wlanMac = await DeviceInfo.getSerialNumber();
                    const device = new CreateDeviceModel(
                        idiom,
                        name,
                        model,
                        versionString,
                        versionName,
                        versionCode,
                        bundleId,
                        Platform.OS,
                        deviceType,
                        manufacturer,
                        description,
                        REAL_SCREEN_WIDTH,
                        REAL_SCREEN_HEIGHT,
                        computerName,
                        '',
                        '',
                        '',
                        wlanMac,
                        uniqueId);
                    Object.getOwnPropertyNames(device).forEach((value) => {
                        // @ts-ignore
                        req.headers[`${value}`] = `${device[value]}`;
                    });
                } else {
                    console.error('No refreshToken found');
                    cancelTokenSource.cancel('Request canceled due to lack of refresh token');
                }
            }
        }
        return req;
    });

    const responseSuccessHandler = (response: AxiosResponse) => {
        return response;
    };

    // Log & Sanitize errors response
    // => The errors given by server will not be always consistent, so we
    //    could sanitize the response and return proper error to the client.
    const responseErrorHandler = async (error: any) => {
        let errors = [i18n.t('error.message')];
        let message = [i18n.t('error.message')];
        let status = 0;
        if (error.response) {
            if (error.response.data.errors) {
                errors = error.response.data.errors;
            }
            if (error.response.data.error) {
                errors = [error.response.data.error];
            }
            if (error.response.data.message) {
                message = error.response.data.message;
            }
            if (error.response.status) {
                status = error.response.status;
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        return Promise.reject({
            status: status,
            errors: errors,
            message: message,
        });
    };

    instance.interceptors.response.use(
        (response: AxiosResponse) => responseSuccessHandler(response),
        (error: any) => responseErrorHandler(error),
    );

    return instance;
};

const loginApi = createApiInstance(SERVER_URL + LOGIN_API);
const logoutApi = createApiInstance(SERVER_URL + LOGOUT_API);
const licenseApi = createApiInstance(SERVER_URL + LICENSE_API);
const createLicenceApi = (license: ICreateLicenseModel) => {
    return licenseApi.post('', {...license});
};
const getLastPaymentApi =  createApiInstance(SERVER_URL + GET_LAST_PAYMENT_API);
const lastPaymentApi = (companyId: number) => {
    return  getLastPaymentApi.get(`?companyId=${companyId}`);
};
const paymentListApi = createApiInstance(SERVER_URL + GET_PAYMENT_LIST_API);
const deviceApi = createApiInstance(SERVER_URL + DEVICE_API);
const allCompaniesApi = createApiInstance(SERVER_URL + GET_ALL_COMPANYS_API);

export {loginApi, logoutApi, createLicenceApi, lastPaymentApi, getLastPaymentApi, paymentListApi, deviceApi, allCompaniesApi};
