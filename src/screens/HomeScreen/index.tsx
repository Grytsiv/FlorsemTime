import React from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {TRootState} from '../../boot/configureStore.ts';
import {CreateLicenseModel} from '../../models/ICreateLicenseModel.ts';
import {RefreshAction} from '../../models/IRefreshResult.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import ActionCreators from '../../actions';
import styles from './styles';

const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    React.useEffect(() => {
        dispatch(ActionCreators.handleLastPayment());
    }, [dispatch]);

    const {licenseDate, lastPayment} = useAppSelector((state: TRootState) => state.homeReducer);

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

    const now = new Date();
    const days = Math.floor(moment.duration(licenseDateInput.valueOf() - now.valueOf()).asDays());
    const startDate = new Date(moment(now).toDate()); //today
    const endDate = new Date(moment(now).add(1, 'year').toDate()); //+ 1 year
    const validDate = new Date(moment(lastPayment.StartDate).add(lastPayment.Period, 'days').toDate());
    const validDays = Math.floor(moment.duration(validDate.valueOf() - now.valueOf()).asDays());
    const validTo = moment.utc(validDate).format('YYYY-MM-DD');

    return (
        <View style={styles.container}>
            {lastPayment.Id > 0 && <Text style={styles.firstTextLine}>{t('homeScreen.licenseValid', {validDays, validTo})}</Text>}
            {lastPayment.Id > 0 && <Text style={styles.textLine}>{t('homeScreen.cardNumber', {cardNumber:lastPayment.CardNumber})}</Text>}
            {lastPayment.Id > 0 && <Text style={styles.textLine}>{t('homeScreen.cardOwner', {cardOwner:lastPayment.CardOwnerName})}</Text>}
            {lastPayment.Id > 0 && <Text style={styles.textLine}>{t('homeScreen.lastPaymentId', {lastPaymentId:lastPayment.Id})}</Text>}
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
                style={styles.button}
                icon="license"
                mode="outlined"
                onPress={() => {
                    const newLicense = new CreateLicenseModel(days);
                    console.log('Press:', newLicense);
                    dispatch(ActionCreators.handleRenewLicense(newLicense));
                }}>
                {t('homeScreen.renewLicenseText', {days: days.toString()})}
            </Button>
            <Button
                style={styles.bottomButton}
                mode="outlined"
                onPress={() => dispatch(ActionCreators.handleRefresh(new RefreshAction()))}>
                {t('homeScreen.refreshTokenButton')}
            </Button>
        </View>
    );
};

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
