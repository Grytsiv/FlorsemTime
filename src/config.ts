import {Dimensions, PixelRatio} from 'react-native';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_SCALE = Dimensions.get('window').scale;
export const SCREEN_FONT_SCALE = Dimensions.get('window').fontScale;
export const REAL_SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(SCREEN_HEIGHT);
export const REAL_SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(SCREEN_WIDTH);

export const DEFAULT_TIME_OUT = 60000; //1 minute

export const DEV_SERVER_URL: string = 'http://176.117.164.49:50133';
export const STAGING_SERVER_URL: string = 'http://88.135.216.102:50139';
export const PRODUCTION_SERVER_URL: string = 'http://88.135.216.102:50133';

export const SERVER_URL: string = STAGING_SERVER_URL;
export const LOGIN_API: string = '/api/users/login';
export const LOGOUT_API: string = '/api/users/logout';
export const LICENSE_API: string = '/api/payments/createlicence';
export const GET_LAST_PAYMENT_API: string = '/api/payments/getLastPayment';
export const DEVICE_API: string = '/api/devices/get';
