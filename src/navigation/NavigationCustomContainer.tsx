import React, {useEffect} from 'react';
import {Animated, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import {navigationRef} from './NavigationService';
import {NavigationContainer, Theme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {useAppDispatch, useAppSelector} from '../boot/hooks';
import ActionCreators from '../actions';
import {TRootState} from '../boot/configureStore';
import {useTranslation} from 'react-i18next';
import DrawerIcon from '../components/DrawerIcon';
import DrawerMenu from '../components/DrawerMenu';
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

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
        </AuthStack.Navigator>
    );
};

const LoggedInDrawer = createDrawerNavigator();

const LoggedInNavigator = () => {
    const {t} = useTranslation();
    return (
        <LoggedInDrawer.Navigator
            screenOptions={{
                headerShown: true,
                headerLeft: () => <DrawerIcon />,
            }}
            drawerContent={props => <DrawerMenu {...props} />}>
            <LoggedInDrawer.Screen name={t('homeScreen.title')} component={HomeScreen} />
        </LoggedInDrawer.Navigator>
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
