import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, AppState, Appearance, AppStateStatus} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Keychain from 'react-native-keychain';
import BusyIndicator from '../BusyIndicator';
import ActionCreators from '../../actions';
import {TRootState} from '../../boot/configureStore';
import {KEYCHAIN_STORAGE} from '../../config.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import {INetInfo, NetInfoClass} from '../../models/netInfoModel.ts';
import styles from './styles';

interface IAppServiceWrapper {
    children: React.ReactNode;
}
/*
Non-UI Component!!!
 */
const AppServiceWrapper: React.FC<IAppServiceWrapper> = ({children}) => {

    const dispatch = useAppDispatch();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        dispatch(ActionCreators.appStateChanged(appState.current));
    }, [dispatch]);

    const {netInfoState, isBusy, isRegistered} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );

    useEffect(() => {
        if (isRegistered === undefined) {
            const checkKeychain = async () => {
                try {
                    // Retrieve the credentials
                    const credentials = await Keychain.getGenericPassword({storage: KEYCHAIN_STORAGE});
                    if (credentials) {
                        const parsedValues = JSON.parse(
                            credentials.password,
                        );
                        dispatch(
                            ActionCreators.userAlreadyAuthorized({
                                accessToken: parsedValues.accessToken,
                                login: credentials.username,
                                refreshToken: parsedValues.refreshToken,
                            }),
                        );
                    } else {
                        console.log('No credentials stored');
                        //setUserRegistered(false);
                        dispatch(ActionCreators.authStateChanged(false));
                    }
                } catch (error) {
                    console.log("Keychain couldn't be accessed!", error);
                    dispatch(ActionCreators.authStateChanged(false));
                }
            };
            checkKeychain().then(() =>
                console.log('The work with the Keychain is complete'),
            );
        }
    }, [isRegistered, dispatch]);

    const {isDark} = useAppSelector(
        (state: TRootState) => state.themeReducer,
    );

    const isDarkScheme = useMemo(() => Appearance.getColorScheme() === 'dark', []);

    const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        appState.current = nextAppState;
        dispatch(ActionCreators.appStateChanged(appState.current));
        console.log('AppState', appState.current);
    }, [dispatch]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [handleAppStateChange]);

    useEffect(() => {
        let netInfo: INetInfo = netInfoState;
        const unsubscribe = NetInfo.addEventListener(state => {
            const newNetInfoState = new NetInfoClass(state.details, state.isConnected!, state.isInternetReachable, state.type);
            if (!netInfo?.isEqual(newNetInfoState)) {
                netInfo = newNetInfoState;
                // Dispatch your actions here based on the netInfo state
                dispatch(ActionCreators.connectionHasBeenChanged(newNetInfoState));
            }
        });
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, [dispatch, netInfoState]);

    useEffect(() => {
        if (isDark !== isDarkScheme) {
            dispatch(ActionCreators.setIsDarkTheme(isDarkScheme));
        }
    }, [isDark, isDarkScheme, dispatch]);

    return (
        <View style={styles.container}>
            {children}
            {isBusy && <BusyIndicator />}
        </View>
    );
};
export default AppServiceWrapper;
