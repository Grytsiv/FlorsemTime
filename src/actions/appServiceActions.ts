import {CONNECTION_CHANGED, APP_STATE_CHANGED} from './types';
import {NetInfoState} from '@react-native-community/netinfo';
export const connectionHasBeenChanged = (netInfoState: NetInfoState) => ({
    type: CONNECTION_CHANGED,
    payload: {netInfoState},
});
export function appStateChanged(appState: string) {
    return {
        type: APP_STATE_CHANGED,
        payload: {appState},
    };
}
