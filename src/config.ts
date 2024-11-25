import {Dimensions} from 'react-native';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_SCALE = Dimensions.get('window').scale;
export const SCREEN_FONT_SCALE = Dimensions.get('window').fontScale;

export const DEFAULT_TIME_OUT = 60000; //1 minute

export const STAGING_SERVER_URL: string = 'http://176.117.164.49:50133';
export const PRODUCTION_SERVER_URL: string = 'http://localhost:4000';

export const SERVER_URL: string = STAGING_SERVER_URL;
export const LOGIN_API: string = '/api/users/login';
export const LOGOUT_API: string = '/api/users/logout';
export const LICENSE_API: string = '/api/payments/createlicence';
