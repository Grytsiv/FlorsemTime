import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {View, AppState, Appearance} from 'react-native';
import {ActivityIndicator, Portal} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import ActionCreators from '../../actions';
import {TRootState} from '../../boot/configureStore';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import styles from './styles';
import {INetInfo, NetInfoClass} from '../../models/netInfoModel.ts';
/*
Non-UI Component!!!
 */
const AppServiceWrapper = ({
                               children,
                           }: PropsWithChildren): React.ReactElement => {
    const dispatch = useAppDispatch();

    const appState = useRef(AppState.currentState);

    const {netInfoState, isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );
    const {isDark} = useAppSelector(
        (state: TRootState) => state.themeReducer,
    );

    const colorScheme = Appearance.getColorScheme();
    const isDarkScheme = colorScheme === 'dark';

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            dispatch(ActionCreators.appStateChanged(appState.current));
            console.log('AppState', appState.current);
        });
        return () => {
            subscription.remove();
        };
    }, [dispatch]);

    useEffect(() => {
        let netInfo: INetInfo = netInfoState;
        const unsubscribe = NetInfo.addEventListener(state => {
            const newNetInfoState = new NetInfoClass(state.details, state.isConnected!, state.isInternetReachable, state.type);
            if (JSON.stringify(newNetInfoState) !== JSON.stringify(netInfo)) {
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
    });

    return (
        <View style={styles.container}>
            {children}
            {isBusy && (
                <View>
                    <Portal>
                        <ActivityIndicator
                            size={'large'}
                            animating={true}
                            style={styles.modalContainerStyle}
                        />
                    </Portal>
                </View>
            )}
        </View>
    );
};
export default AppServiceWrapper;
