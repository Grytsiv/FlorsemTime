import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {TRootState} from '../../boot/configureStore.ts';
import {CreateLicenseModel} from '../../models/ICreateLicenseModel.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import ActionCreators from '../../actions';
import styles from './styles';

const HomeScreen: FC = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {licenseDate} = useAppSelector((state: TRootState) => state.homeReducer);

    const [licenseDateInput, setLicenseDate] = React.useState<Date>(licenseDate);
    const onChangeLicenseDate = React.useCallback(
        (date: React.SetStateAction<Date | undefined>) => {
            if (date !== undefined) {
                // @ts-ignore
                setLicenseDate(date);
            }
        },
        [],
    );
    useEffect(() => {
        dispatch(ActionCreators.handleRefresh());
    }, [dispatch]);

    const now = new Date();
    const days = Math.floor(moment.duration(licenseDateInput.valueOf() - now.valueOf()).asDays());
    const startDate = new Date(moment(now).toDate()); //today
    const endDate = new Date(moment(now).add(1, 'year').toDate()); //+ 1 year

    return (
        <View style={styles.container}>
            <Text>{t('homeScreen.label')}</Text>
            <DatePickerInput
                style={styles.dateInput}
                locale="en"
                label={t('homeScreen.arrivalDate')}
                value={licenseDateInput}
                onChange={onChangeLicenseDate}
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
                icon="license"
                mode="outlined"
                onPress={() => {
                    const newLicense = new CreateLicenseModel(days);
                    console.log(newLicense);
                    dispatch(ActionCreators.handleRenewLicense(newLicense));
                }}>
                {t('homeScreen.renewLicenseText', {days: days.toString()})}
            </Button>
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
