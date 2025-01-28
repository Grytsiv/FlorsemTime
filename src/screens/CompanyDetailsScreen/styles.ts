import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        height: SCREEN_HEIGHT,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerStyle: {
        backgroundColor: colors.transparent,
        padding: 20,
    },
    dateInput: {
        width: SCREEN_WIDTH - 60,
        height: 50,
        maxHeight: 50,
        marginLeft: 24,
        marginRight: 24,
    },
    firstTextLine: {
        marginTop: 40,
    },
    textLine: {
        marginTop: 10,
    },
    button: {
        marginBottom: 190,
    },
});

export default styles;
