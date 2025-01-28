import React, {FC, useEffect} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Button, Text} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import moment from 'moment/moment';
import {useTranslation} from 'react-i18next';
import {TRootState} from '../../boot/configureStore';
import ActionCreators from '../../actions';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import styles from './styles';
import {CreateLicenseModel} from '../../models/ICreateLicenseModel.ts';
import colors from '../../theme/colors.ts';

const CompanyDetailsScreen: FC = () => {
    const routeProp = useRoute();
    // @ts-ignore
    const {item} = routeProp.params;

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const {licenseDate, lastPayment} = useAppSelector((state: TRootState) => state.homeReducer);
    const {user:{RoleId}} = useAppSelector((state: TRootState) => state.profileReducer);

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

    const now = new Date().valueOf();
    const days = Math.floor(moment.duration(licenseDateInput.valueOf() - now.valueOf()).asDays());
    const startDate = new Date(moment(now).add(1, 'day').toDate()); //today +1 day
    const endDate = new Date(moment(now).add(1, 'year').toDate()); //+ 1 year
    const validDate = lastPayment.Id === -1 ? new Date(moment(item.payment.StartDate).add(item.payment.Period + 1, 'days').toDate()).valueOf() : new Date(moment(lastPayment.StartDate).add(lastPayment.Period + 1, 'days').toDate()).valueOf();
    const validDays = Math.floor(moment.duration(validDate - now).asDays());
    const validTo = moment.utc(validDate).format('YYYY-MM-DD');
    const isDateValid = validDate > now;

    useEffect(() => {
        //dispatch(ActionCreators.handleUserInfo());
    }, [dispatch]);

    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );

    const onRefresh = () => {
        dispatch(ActionCreators.handleLastPayment(item.company.Id));
    };

    return (
        <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isBusy} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
                <Text style={styles.textLine}>{item.company.Name}, ID:{item.company.Id}</Text>
                {lastPayment.Id === -1 ? <Text style={[styles.firstTextLine, {color: isDateValid ? colors.royalBlue : colors.guardsmanRed}]}>{t('homeScreen.licenseValid', {validDays, validTo})}</Text> : <Text style={[styles.firstTextLine, {color: isDateValid ? colors.royalBlue : colors.guardsmanRed}]}>{t('homeScreen.licenseValid', {validDays, validTo})}</Text>}
                {lastPayment.Id === -1 ? <Text style={styles.textLine}>{t('homeScreen.cardNumber', {cardNumber: item.payment.CardNumber})}</Text> : <Text style={styles.textLine}>{t('homeScreen.cardNumber', {cardNumber: lastPayment.CardNumber})}</Text>}
                {lastPayment.Id === -1 ? <Text style={styles.textLine}>{t('homeScreen.cardOwner', {cardOwner: item.payment.CardOwnerName})}</Text> : <Text style={styles.textLine}>{t('homeScreen.cardOwner', {cardOwner: lastPayment.CardOwnerName})}</Text>}
                {lastPayment.Id === -1 ? <Text style={styles.textLine}>{t('homeScreen.companyId', {companyId: item.payment.CompanyId})}</Text> : <Text style={styles.textLine}>{t('homeScreen.companyId', {companyId: lastPayment.CompanyId})}</Text>}
                {lastPayment.Id === -1 ? <Text style={styles.textLine}>{t('homeScreen.lastPaymentId', {lastPaymentId: item.payment.Id})}</Text> : <Text style={styles.textLine}>{t('homeScreen.lastPaymentId', {lastPaymentId: lastPayment.Id})}</Text>}
                {RoleId === 1 &&
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
                }
                {RoleId === 1 &&
                    <Button
                        style={styles.button}
                        icon="license"
                        mode="outlined"
                        onPress={() => {
                            const newLicense = new CreateLicenseModel(days);
                            newLicense.CompanyId = item.company.Id;
                            dispatch(ActionCreators.handleRenewLicense(newLicense));
                        }}>
                        {t('homeScreen.renewLicenseText', {days: days.toString()})}
                    </Button>
                }
            </View>
        </ScrollView>
    );
};

export default CompanyDetailsScreen;
