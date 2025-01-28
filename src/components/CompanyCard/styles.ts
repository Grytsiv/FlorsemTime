import {StyleSheet} from 'react-native';
import colors from '../../theme/colors.ts';
import {SCREEN_WIDTH} from '../../config.ts';

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH - 30,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: colors.pumice,
        borderWidth: 1,
        borderColor: colors.royalBlue,
    },
    rowHeader: {
        flexDirection: 'row',
        flex: 3,
        marginHorizontal: 6,
    },
    marginTop: {
        marginTop: 11,
    },
    textFlex2: {
        color: '#000000FF',
        flex: 2,
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15,
        letterSpacing: 0.15,
    },
    textValue: {
        color: '#000000FF',
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15,
        letterSpacing: 0.15,
        marginHorizontal: 6,
    },
    marginHorizontal: {
        marginHorizontal: 0,
    },
    textRef: {
        color: '#000000FF',
        paddingTop: 1,
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15,
        letterSpacing: 0.15,
        marginHorizontal: 6,
    },
    rowWithIcon: {
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'space-between',
        marginRight: -8,
    },
    rowWithText: {
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'flex-start',
        marginRight: -8,
    },
    row: {
        flexDirection: 'row',
    },
    textBold: {
        color: '#000000FF',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 15,
        letterSpacing: 0.9,
        marginRight: 10,
    },
    lastUpdatedDate: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 15,
        letterSpacing: 0.15,
        marginRight: 27,
    },
});
export default styles;
