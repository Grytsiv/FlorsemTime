import React from 'react';
import {View} from 'react-native';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Button, Divider, Text} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import {useTranslation} from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import {RefreshAction} from '../../models/IRefreshResult.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import {TRootState} from '../../boot/configureStore';
import ActionCreators from '../../actions';
import styles from './styles';

const DrawerMenu: React.FC<DrawerContentComponentProps> = props => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const userState = useAppSelector(
        (state: TRootState) => state.profileReducer.user,
    );
    const avatarLabel = userState
        ? userState.name?.substring(0, 2)
        : '';
    const appVersion = `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;

    return (
        <DrawerContentScrollView {...props}>
            {userState ? <Divider /> : null}
            {userState ? (
                <Avatar.Text style={styles.avatar} size={36} label={avatarLabel} />
            ) : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.name')}{userState.name}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.phone')}{userState.phone}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.city')}{userState.city}</Text> : null}
            {userState ? <Divider /> : null}
            <DrawerItemList {...props} />
            <Divider />
            <Button
                style={styles.logOutButton}
                icon="logout"
                mode="outlined"
                onPress={() => dispatch(ActionCreators.handleRevoke())}>
                {t('homeScreen.logoutButton')}
            </Button>
            <Divider />
            <View style={styles.button}/>
            <Divider />
            <Button
                style={styles.logOutButton}
                mode="outlined"
                onPress={() => Sentry.captureException(new Error('First error'))}>
                {t('homeScreen.sentryButton')}
            </Button>
            <View style={styles.buttonBetween}/>
            <Button
                style={styles.logOutButton}
                mode="outlined"
                onPress={() => dispatch(ActionCreators.handleRefresh(new RefreshAction()))}>
                {t('homeScreen.refreshTokenButton')}
            </Button>
            <Divider />
            <Text style={styles.versionText}>
                {t('drawerMenu.version')}
                {appVersion}
            </Text>
        </DrawerContentScrollView>
    );
};

export default DrawerMenu;
