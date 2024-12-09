import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from '../../config.ts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateInput: {
        width: SCREEN_WIDTH - 60,
        height: 50,
        maxHeight: 50,
        marginTop: 24,
        marginLeft: 24,
        marginRight: 24,
    },
    firstTextLine: {
        marginTop: 40,
    },
    textLine: {
        marginTop: 10,
    },
    bottomButton: {
        marginBottom: 40,
    },
    button: {
        marginBottom: 20,
    },
});
export default styles;
