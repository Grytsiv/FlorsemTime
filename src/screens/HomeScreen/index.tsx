import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {TRootState} from '../../boot/configureStore.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import ActionCreators from '../../actions';
import styles from './styles';

const HomeScreen: FC = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {arrivalDate} = useAppSelector((state: TRootState) => state.homeReducer);

    const [arrivalDateInput, setArrivalDate] = React.useState(arrivalDate);
    const onChangeArrivalDate = React.useCallback(
        (date: React.SetStateAction<Date | undefined>) => {
            setArrivalDate(date);
        },
        [],
    );
    useEffect(() => {
        dispatch(ActionCreators.handleRefresh());
    }, [dispatch]);

    const now = new Date();
    const startDate = new Date(moment(now).toDate()); //today
    const endDate = new Date(moment(now).add(1, 'year').toDate()); //+ 1 year

    return (
        <View style={styles.container}>
            <Text>{t('homeScreen.label')}</Text>
            <DatePickerInput
                style={styles.dateInput}
                locale="en"
                label={t('homeScreen.arrivalDate')}
                value={arrivalDateInput}
                onChange={onChangeArrivalDate}
                inputMode="start"
                mode="outlined"
                startYear={startDate.getFullYear()}
                endYear={endDate.getFullYear()}
                validRange={{
                    startDate,
                    endDate,
                }}
            />
            <Button
                icon="logout"
                mode="outlined"
                onPress={() => dispatch(ActionCreators.handleRevoke())}>
                {t('homeScreen.logoutButton')}
            </Button>
            <Button
                mode="outlined"
                onPress={() => dispatch(ActionCreators.handleRefresh())}>
                {t('homeScreen.refreshTokenButton')}
            </Button>
        </View>
    );
};

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
