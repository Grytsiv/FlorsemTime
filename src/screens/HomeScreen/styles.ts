import {StyleSheet} from 'react-native';
import colors from '../../theme/colors.ts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 16,
        paddingBottom: 16,
        flexGrow: 1,
    },
    scrollIndicatorInsets: {
        right: 1,
    },
    firstTextLine: {
        marginTop: 40,
        marginLeft: 24,
        marginRight: 24,
    },
    textUserLine: {
        marginTop: 40,
        color: colors.guardsmanRed,
        marginLeft: 24,
        marginRight: 24,
    },
    textLine: {
        marginTop: 10,
        marginLeft: 24,
        marginRight: 24,
    },
    button: {
        marginBottom: 20,
    },
});
export default styles;
