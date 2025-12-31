import {Dimensions, PixelRatio} from 'react-native';
// import * as Keychain from 'react-native-keychain';
// import {STORAGE_TYPE} from 'react-native-keychain';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
// export const SCREEN_SCALE = Dimensions.get('window').scale;
// export const SCREEN_FONT_SCALE = Dimensions.get('window').fontScale;
export const REAL_SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(SCREEN_HEIGHT);
export const REAL_SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(SCREEN_WIDTH);

export const DEFAULT_TIME_OUT = 60000; //1 minute
export const MAX_CONNECTION_RETRIES = 10;
export const CONNECTION_RETRY_DELAY_MS = 100;

export const DEV_SERVER_URL: string = 'https://176.117.164.49:50133';
export const STAGING_SERVER_URL: string = 'https://ag.if.ua:60135';
export const PRODUCTION_SERVER_URL: string = 'https://ag.if.ua:50236';

export const SERVER_URL: string = PRODUCTION_SERVER_URL;
export const LOGIN_API: string = '/api/payment/login';
export const LOGOUT_API: string = '/api/payment/logout';
export const LICENSE_API: string = '/api/khymcor/createpayment';
export const GET_LAST_PAYMENT_API: string = '/api/payments/getLastPayment';
export const GET_PAYMENT_LIST_API: string = '/api/payment/getall';

export const SENTRY_DSN: string = 'https://536081d2ce8a132df497ab3462553191@o4508523330076672.ingest.de.sentry.io/4508523344298064';
//export const KEYCHAIN_STORAGE: STORAGE_TYPE = Platform.OS === 'ios' ? Keychain.STORAGE_TYPE.KC : Keychain.STORAGE_TYPE.FB;
