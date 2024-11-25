import colors from './colors';
import {DefaultTheme} from 'react-native-paper';
export default {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.pictonBlue,
        secondary: colors.corn,
        errorStyleTextColor: colors.corn,
        grayThree: colors.yellowGreen,
    },
    Button: {buttonStyle: {margin: 10}},
};
