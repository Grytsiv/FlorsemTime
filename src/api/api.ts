import {Platform} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import DeviceInfo from 'react-native-device-info';
import {
    SERVER_URL,
    LOGIN_API,
    LOGOUT_API,
    LICENSE_API,
    DEFAULT_TIME_OUT,
    REAL_SCREEN_WIDTH,
    REAL_SCREEN_HEIGHT,
    GET_PAYMENT_LIST_API,
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
              req.headers.uniqueId = uniqueId;
            }
        }
        return req;
    });

    const responseSuccessHandler = (response: AxiosResponse) => {
        return response;
    };

    // Log & Sanitize errors response
    // => The errors given by the server will not be always consistent, so we
    //    could sanitize the response and return the proper error to the client.
    const responseErrorHandler = async (error: any) => {
      const defaultErrorMessage = i18n.t('error.message');
      let status = (-1);
      let errors = [defaultErrorMessage];
      let message = defaultErrorMessage;

      if (error.response) {
        const responseData = error.response.data || {};
        status = error.response.status || (-1);

        errors = responseData.errors || [responseData.error] || [defaultErrorMessage];
        message = responseData.message ? responseData.message : message;
      }

      return Promise.reject({
        status,
        errors,
        message,
        originalError: error, // Original Error for Sentry
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
const licenseOldApi = createApiInstance(SERVER_URL + LICENSE_API);
const paymentListApi = createApiInstance(SERVER_URL + GET_PAYMENT_LIST_API);

export {loginApi, logoutApi, licenseApi, licenseOldApi, paymentListApi};
