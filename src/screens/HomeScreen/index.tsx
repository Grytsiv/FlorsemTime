import React from 'react';
import {FlatList, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {IMergedCompanyModel, MergedCompanyModel} from '../../models/ICompanyModel.ts';
import {TRootState} from '../../boot/configureStore.ts';
import {RefreshAction} from '../../models/IRefreshResult.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import CompanyCard from '../../components/CompanyCard';
import ActionCreators from '../../actions';
import colors from '../../theme/colors.ts';
import styles from './styles';

const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const {t} = useTranslation();

    const {isBusy} = useAppSelector((state: TRootState) => state.appServiceReducer);
    const {lastPayment, paymentList, allCompanies} = useAppSelector((state: TRootState) => state.homeReducer);
    const {user:{RoleId, Name, Surname}} = useAppSelector((state: TRootState) => state.profileReducer);

    let mergedCompanies: IMergedCompanyModel[] = [];
    if (allCompanies.length > 0) {
        for (let i = 0; i < allCompanies.length; i++) {
            const company = allCompanies[i];
            const payment = paymentList[i];
            mergedCompanies = [...mergedCompanies, new MergedCompanyModel(company, payment)];
        }
    }
    React.useEffect(() => {
        if (RoleId === -1) {
            dispatch(ActionCreators.handleRefresh(new RefreshAction()));
        }
    }, [RoleId, dispatch]);

    const now = new Date().valueOf();
    const validDate = new Date(moment(lastPayment.StartDate).add(lastPayment.Period + 1, 'days').toDate()).valueOf();
    const validDays = Math.floor(moment.duration(validDate - now).asDays());
    const validTo = moment.utc(validDate).format('YYYY-MM-DD');
    const isDateValid = validDate > now;

    const handleCardPress = (item: IMergedCompanyModel) => {
        dispatch(ActionCreators.clearLastPayment());
        //@ts-ignore
        navigation.navigate('CompanyDetailsScreen', {item});
    };

    const onRefresh = React.useCallback(() => {
        if (RoleId === 1) {
            dispatch(ActionCreators.handlePaymentList());
        } else if (RoleId > 1) {
            dispatch(ActionCreators.handleLastPayment(undefined));
        }
    }, [RoleId, dispatch]);

    useFocusEffect(
        React.useCallback(() => {
            onRefresh();
        }, [onRefresh])
    );

    return (
        <View style={styles.container}>
            {RoleId === 1 ?
                <FlatList
                    contentOffset={{y: isBusy ? -60 : 0, x: 0}} // <-- if loading, set offset, this fix list shift after loading
                    data={mergedCompanies}
                    keyExtractor={item => item.company.Id.toString()}
                    refreshing={isBusy}
                    onRefresh={onRefresh}
                    contentContainerStyle={styles.contentContainer}
                    scrollIndicatorInsets={styles.scrollIndicatorInsets}
                    renderItem={({item}) => (
                        <CompanyCard
                            item={item}
                            onPress={() => handleCardPress(item)}
                        />
                    )}
                />
                :
                <View>
                    {lastPayment.Id > -1 && <Text style={[styles.firstTextLine, {color: isDateValid ? colors.royalBlue : colors.guardsmanRed}]}>{t('homeScreen.licenseValid', {validDays, validTo})}</Text>}
                    {lastPayment.Id > -1 && <Text style={styles.textLine}>{t('homeScreen.cardNumber', {cardNumber:lastPayment.CardNumber})}</Text>}
                    {lastPayment.Id > -1 && <Text style={styles.textLine}>{t('homeScreen.cardOwner', {cardOwner:lastPayment.CardOwnerName})}</Text>}
                    {lastPayment.Id > -1 && <Text style={styles.textLine}>{t('homeScreen.companyId', {companyId:lastPayment.CompanyId})}</Text>}
                    {lastPayment.Id > -1 && <Text style={styles.textLine}>{t('homeScreen.lastPaymentId', {lastPaymentId:lastPayment.Id})}</Text>}
                    {lastPayment.Id === -1 && <Text style={styles.textUserLine}>{t('homeScreen.forbidden', {name:Name, surname: Surname})}</Text>}
                </View>
            }
        </View>
    );
};

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
