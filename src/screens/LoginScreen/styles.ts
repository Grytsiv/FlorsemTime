import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from '../../config.ts';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: SCREEN_WIDTH - 48,
        marginTop: 24,
        marginLeft: 24,
        marginRight: 24,
    },
    button: {
        width: SCREEN_WIDTH - 48,
        marginTop: 24,
    },
});
export default styles;
