import React from 'react';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Button, Divider, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
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
        ? userState.Name?.substring(0, 1) + userState.Surname?.substring(0, 1)
        : '';
    return (
        <DrawerContentScrollView {...props}>
            {userState ? <Divider /> : null}
            {userState ? (
                <Avatar.Text style={styles.avatar} size={36} label={avatarLabel} />
            ) : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.role')}{userState.RoleName}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.name')}{userState.Name}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.surname')}{userState.Surname}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.phone')}{userState.Phone}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.email')}{userState.Email}</Text> : null}
            {userState ? <Text style={styles.email}>{t('drawerMenu.address')}{userState.Address}</Text> : null}
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
        </DrawerContentScrollView>
    );
};

export default DrawerMenu;
