import axios, {AxiosResponse} from 'axios';
import {
    SERVER_URL,
    LOGIN_API,
    LOGOUT_API,
    LICENSE_API,
    DEFAULT_TIME_OUT,
} from '../config';
import {getTokenFromKeychain} from '../utils/keychainStorage';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage';
import {ICreateLicenseModel} from '../models/ICreateLicenseModel.ts';

const createApiInstance = (baseURL: string) => {

    const instance = axios.create({
        baseURL,
        timeout: Number(DEFAULT_TIME_OUT),
    });

    let cancelTokenSource = axios.CancelToken.source();

    instance.interceptors.request.use(async req => {
        const accessToken = await getTokenFromKeychain(KEYCHAIN_TOKEN_KEY.accessToken);
        const refreshToken = await getTokenFromKeychain(KEYCHAIN_TOKEN_KEY.refreshToken);
        if (req.headers) {
            req.headers['Content-Type'] = 'application/json';
            if (baseURL.endsWith(LOGIN_API)) {
                if (accessToken) {
                    req.headers.Authorization = `Basic ${accessToken}`;
                }
            } else {
                if (refreshToken) {
                    req.headers.Authorization = `Bearer ${refreshToken}`;
                }
            }
        }
        // Set the cancel token for the request
        req.cancelToken = cancelTokenSource.token;
        return req;
    });

    const responseSuccessHandler = (response: AxiosResponse) => {
        return response;
    };

    // Log & Sanitize errors response
    // => The errors given by server will not be always consistent, so we
    //    could sanitize the response and return proper error to the client.
    const responseErrorHandler = async (error: any) => {
        let errors = ['Something went wrong, please try again!'];
        let message = ['Something went wrong, please try again!'];
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
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return Promise.reject({
            status: error.response.status,
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

export {loginApi, logoutApi, createLicenceApi};
