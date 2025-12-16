import React, {FC} from 'react';
import {Animated, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CompanyDetailsScreen from '../screens/CompanyDetailsScreen';
import {navigationRef} from './NavigationService';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {useAppSelector} from '../boot/hooks';
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
    const {t} = useTranslation();
    const isRegisteredState = useAppSelector(
        (state: TRootState) => state.appServiceReducer.isRegistered,
    );
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
                    <Stack.Group>
                        <Stack.Screen
                            name="LoggedInStackHome"
                            component={LoggedInNavigator}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: true,
                                title: t('companyDetailsScreen.title'),
                            }}
                            name="CompanyDetailsScreen"
                            component={CompanyDetailsScreen as FC}
                        />
                    </Stack.Group>
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
