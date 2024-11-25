import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {View, AppState, Appearance} from 'react-native';
import {ActivityIndicator, Portal} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import ActionCreators from '../../actions';
import {TRootState} from '../../boot/configureStore';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import styles from './styles';
/*
Non-UI Component!!!
 */
const AppServiceWrapper = ({
                               children,
                           }: PropsWithChildren): React.ReactElement => {
    const dispatch = useAppDispatch();

    const appState = useRef(AppState.currentState);

    const netInfoState = useAppSelector(
        (state: TRootState) => state.appServiceReducer.netInfoState,
    );
    const isDarkState = useAppSelector(
        (state: TRootState) => state.themeReducer.isDark,
    );
    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );

    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';

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
        const unsubscribe = NetInfo.addEventListener(state => {
            if (JSON.stringify(state) !== JSON.stringify(netInfoState)) {
                // Dispatch your actions here based on the netInfo state
                dispatch(ActionCreators.connectionHasBeenChanged(state));
            }
        });
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, [dispatch, netInfoState]);

    useEffect(() => {
        if (isDarkState !== isDark) {
            dispatch(ActionCreators.setIsDarkTheme(isDark));
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
