import React, {FC} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import moment from 'moment/moment';
import {useTranslation} from 'react-i18next';
import {TRootState} from '../../boot/configureStore';
import ActionCreators from '../../actions';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import styles from './styles';
import {CreateOldLicenseModel} from '../../models/ICreateLicenseModel.ts';
import colors from '../../theme/colors.ts';

const FlorsemScreen: FC = () => {

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const now = new Date().valueOf();
    const [licenseDateInput, setLicenseDate] = React.useState<Date>(new Date(moment(now).add(30, 'day').toDate()));

    const onChangeLicenseDate = React.useCallback(
        (date: React.SetStateAction<Date | undefined>) => {
            if (date !== undefined) {
                // @ts-ignore
                setLicenseDate(date);
            }
        },
        [],
    );

    const days = Math.floor(moment.duration(licenseDateInput.valueOf() - now.valueOf()).asDays() + 1);
    const startDate = new Date(moment(now).add(0, 'day').toDate()); //today +1 day
    const endDate = new Date(moment(now).add(1, 'year').toDate()); //+ 1 year

    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );
    const {lastPayment} = useAppSelector((state: TRootState) => state.florsemReducer);

    const validDate = lastPayment.Id === -1 ? new Date(moment(now).add(days, 'days').toDate()).valueOf() : new Date(moment(lastPayment.StartDate).add(lastPayment.Period, 'days').toDate()).valueOf();
    const validDays = Math.floor(moment.duration(validDate - now).asDays());
    const validTo = moment.utc(validDate).format('YYYY-MM-DD');
    const isDateValid = validDate > now;

    return (
        <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isBusy} />
            }>
            <View style={styles.container}>
                <Text style={styles.textLine}>Florsem Old</Text>
                <Text style={[styles.firstTextLine, {color: isDateValid ? colors.royalBlue : colors.guardsmanRed}]}>{t('homeScreen.licenseValid', {validDays, validTo})}</Text>
                <Text style={styles.textLine}>{t('homeScreen.lastPaymentId', {lastPaymentId: lastPayment.Id})}</Text>
                <DatePickerInput
                    style={styles.dateInput}
                    locale="en"
                    //label={t('homeScreen.arrivalDate')}
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
                        const newLicense = new CreateOldLicenseModel(days);
                        dispatch(ActionCreators.handleRenewOldLicense(newLicense));
                    }}>
                    {t('homeScreen.renewLicenseText', {days: days.toString()})}
                </Button>
            </View>
        </ScrollView>
    );
};

export default FlorsemScreen;
