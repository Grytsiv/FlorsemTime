import React, {FC} from 'react';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import ActionCreators from '../../actions';
import {TRootState} from '../../boot/configureStore';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const LoginScreen: FC = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const isBusy = useAppSelector(
        (state: TRootState) => state.appServiceReducer.isBusy,
    );

    const [emailInput, setEmail] = React.useState('');
    const [passwordInput, setPassword] = React.useState('');
    const [flatTextSecureEntry, setFlatTextSecureEntry] = React.useState(true);

    const onChangeEmail = React.useCallback(
        (text: React.SetStateAction<string>) => {
            setEmail(text);
        },
        [],
    );
    const onChangePassword = React.useCallback(
        (text: React.SetStateAction<string>) => {
            setPassword(text);
        },
        [],
    );
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                disabled={isBusy}
                label={t('loginScreen.emailLabel')}
                value={emailInput}
                onChangeText={onChangeEmail}
                mode="outlined"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={40}
            />
            <TextInput
                style={styles.textInput}
                disabled={isBusy}
                label={t('loginScreen.passwordLabel')}
                value={passwordInput}
                onChangeText={onChangePassword}
                mode="outlined"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={40}
                secureTextEntry={flatTextSecureEntry}
                multiline={false}
                right={
                    <TextInput.Icon
                        icon={flatTextSecureEntry ? 'eye' : 'eye-off'}
                        onPress={() =>
                            setFlatTextSecureEntry(!flatTextSecureEntry)
                        }
                        forceTextInputFocus={false}
                    />
                }
            />
            <Button
                style={styles.button}
                icon="login"
                mode="outlined"
                disabled={isBusy}
                onPress={() => dispatch(ActionCreators.handleAuthorize(emailInput, passwordInput))}>
                {t('loginScreen.loginButton')}
            </Button>
        </View>
    );
};
LoginScreen.displayName = 'LoginScreen';
export default LoginScreen;
