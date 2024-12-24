import * as Keychain from 'react-native-keychain';
import {KEYCHAIN_TOKEN_KEY} from '../models/keychainStorage';
import {IRefreshResult} from '../models/IRefreshResult.ts';

export const getTokenFromKeychain = async (key: KEYCHAIN_TOKEN_KEY) => {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            const parsedValues: IRefreshResult = JSON.parse(credentials.password);
            return parsedValues != null ? parsedValues[key] : null;
        } else {
            console.log('No tokens stored');
            return null;
        }
    } catch (error) {
        console.log(`Error getting ${key} from Keychain`, error);
        return null;
    }
};
