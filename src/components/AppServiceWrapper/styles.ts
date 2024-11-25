import {StyleSheet} from 'react-native';
import colors from '../../theme/colors.ts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainerStyle: {
        flex: 1,
        backgroundColor: colors.transparent,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default styles;
