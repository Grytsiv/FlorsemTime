import React, {useEffect} from 'react';
import {Animated, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import {navigationRef} from './NavigationService';
import {NavigationContainer, Theme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {useAppDispatch, useAppSelector} from '../boot/hooks';
import ActionCreators from '../actions';
import {RefreshResult} from 'react-native-app-auth';
import {TRootState} from '../boot/configureStore';
import {useTranslation} from 'react-i18next';
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const LoggedInStack = createStackNavigator();
interface IProps {
    theme: Theme;
}
const AuthNavigator = () => {
    const isRegisteredState = useAppSelector(
        (state: TRootState) => state.appServiceReducer.isRegistered,
    );
    return (
        <AuthStack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    // When logging out, a pop animation feels intuitive
                    // You can remove this if you want the default 'push' animation
                    animationTypeForReplace: isRegisteredState ? 'push' : 'pop',
                    headerShown: false,
                }}
            />
            {/*<Stack.Screen*/}
            {/*  name="ForgotPassword"*/}
            {/*  component={ForgotPassword}*/}
            {/*  options={{*/}
            {/*    // When logging out, a pop animation feels intuitive*/}
            {/*    // You can remove this if you want the default 'push' animation*/}
            {/*    animationTypeForReplace: isRegisteredState ? 'push' : 'pop',*/}
            {/*  }}*/}
            {/*/>*/}
        </AuthStack.Navigator>
    );
};
const LoggedInNavigator = () => {
    const {t} = useTranslation();
    return (
        <LoggedInStack.Navigator>
            <Stack.Screen name={t('homeScreen.title')} component={HomeScreen} />
        </LoggedInStack.Navigator>
    );
};
const NavigationCustomContainer: React.FC<IProps> = (props: IProps) => {
    const {theme} = props;
    const dispatch = useAppDispatch();
    const isRegisteredState = useAppSelector(
        (state: TRootState) => state.appServiceReducer.isRegistered,
    );
    useEffect(() => {
        if (isRegisteredState === undefined) {
            const checkKeychain = async () => {
                try {
                    // Retrieve the credentials
                    const credentials = await Keychain.getGenericPassword();
                    if (credentials) {
                        const parsedValues: RefreshResult = JSON.parse(
                            credentials.password,
                        );
                        dispatch(
                            ActionCreators.userAlreadyAuthorized({
                                accessToken: parsedValues.accessToken,
                                accessTokenExpirationDate: credentials.username,
                                idToken: parsedValues.idToken,
                                refreshToken: parsedValues.refreshToken,
                                tokenType: parsedValues.tokenType,
                            }),
                        );
                    } else {
                        console.log('No credentials stored');
                        //setUserRegistered(false);
                        dispatch(ActionCreators.registrationHasBeenChanged(false));
                    }
                } catch (error) {
                    console.log("Keychain couldn't be accessed!", error);
                    dispatch(ActionCreators.registrationHasBeenChanged(false));
                }
            };
            checkKeychain().then(() =>
                console.log('The work with the Keychain is complete'),
            );
        }
    }, [isRegisteredState, dispatch]);
    //Remove Warning "Sending `onAnimatedValueUpdate` with no listeners registered"
    const av = new Animated.Value(0);
    av.addListener(() => {
        return;
    });
    return (
        <NavigationContainer ref={navigationRef} theme={theme}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {isRegisteredState ? (
                    <Stack.Screen
                        name="LoggedInStackHome"
                        component={LoggedInNavigator}
                    />
                ) : (
                    <Stack.Screen
                        name="AuthStackLogin"
                        component={AuthNavigator}
                        options={{headerShown: false}}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default NavigationCustomContainer;
