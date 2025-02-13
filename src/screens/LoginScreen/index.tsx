import React, {FC} from 'react';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import {TRootState} from '../../boot/configureStore';
import ActionCreators from '../../actions';
import {Credentials} from '../../models/ICredentials.ts';
import styles from './styles';

const LoginScreen: FC = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );
    const {login} = useAppSelector(
        (state: TRootState) => state.authenticationReducer,
    );

    const [credentialsInput, setCredentials] = React.useState(new Credentials(login, ''));
    const [flatTextSecureEntry, setFlatTextSecureEntry] = React.useState(true);

    const onChangeEmail = React.useCallback(
        (text: React.SetStateAction<string>) => {
            setCredentials(value => new Credentials(text.toString(), value.password));
        },
        [],
    );
    const onChangePassword = React.useCallback(
        (text: React.SetStateAction<string>) => {
            setCredentials(value => new Credentials(value.login, text.toString()));
        },
        [],
    );
    const isCredentialsInvalid = credentialsInput.login.length === 0 || credentialsInput.password.length === 0;
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                disabled={isBusy}
                label={t('loginScreen.emailLabel')}
                value={credentialsInput.login}
                onChangeText={onChangeEmail}
                mode="outlined"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={40}
            />
            <TextInput
                style={styles.textInput}
                disabled={isBusy}
                label={t('loginScreen.passwordLabel')}
                value={credentialsInput.password}
                onChangeText={onChangePassword}
                mode="outlined"
                autoCapitalize="none"
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
                disabled={isBusy || isCredentialsInvalid}
                onPress={() => dispatch(ActionCreators.handleAuthorize(credentialsInput))}>
                {t('loginScreen.loginButton')}
            </Button>
        </View>
    );
};
LoginScreen.displayName = 'LoginScreen';
export default LoginScreen;
