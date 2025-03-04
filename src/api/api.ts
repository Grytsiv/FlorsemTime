import {Platform} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import DeviceInfo from 'react-native-device-info';
import {
    SERVER_URL,
    PRODUCTION_SERVER_URL,
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
            //console.log('headers: ', req.headers);
            req.headers['Content-Type'] = 'application/json';
            if (baseURL.endsWith(LOGIN_API)) {
                req.headers.uniqueId = uniqueId;
            } else {
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
const licenseOldApi = createApiInstance(PRODUCTION_SERVER_URL + LICENSE_API);
const getLastPaymentApi =  createApiInstance(SERVER_URL + GET_LAST_PAYMENT_API);
const paymentListApi = createApiInstance(SERVER_URL + GET_PAYMENT_LIST_API);
const deviceApi = createApiInstance(SERVER_URL + DEVICE_API);
const allCompaniesApi = createApiInstance(SERVER_URL + GET_ALL_COMPANYS_API);

export {loginApi, logoutApi, licenseApi, licenseOldApi, getLastPaymentApi, paymentListApi, deviceApi, allCompaniesApi};
