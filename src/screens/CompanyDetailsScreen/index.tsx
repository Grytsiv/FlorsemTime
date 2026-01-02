import React, {FC} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import moment from 'moment/moment';
import {useTranslation} from 'react-i18next';
import {TRootState} from '../../boot/configureStore';
import ActionCreators from '../../actions';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import styles from './styles';
import {
  CreateKhymkorLicenseModel,
  ICompanyResponse,
} from '../../models/ICreateLicenseModel.ts';
import colors from '../../theme/colors.ts';

type ScreenProps = {
  route: {params: {item: ICompanyResponse}};
};

const CompanyDetailsScreen: FC<ScreenProps> = ({route}) => {

    const {item} = route.params;

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const now = new Date().valueOf();
    const companyValidToDate =
      item.data.type === 0 ?
        new Date(moment().endOf('month').toDate()).valueOf() :
        new Date(moment(now).add(item.data.daysRemained + 1, 'days').toDate()).valueOf();
    const isDateValid =
      item.data.type === 0 ?
        item.data.agBalance >= 0 && item.data.smsBalance >= 0 :
        item.data.daysRemained >= 0;
    const validDays = Math.floor(moment.duration(companyValidToDate - now).asDays());
    const validTo = moment.utc(companyValidToDate).format('YYYY-MM-DD');

    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );

    const onRefresh = () => {
        //dispatch(ActionCreators.handleLastPayment(item.company.Id));
    };

    return (
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isBusy} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <Text style={styles.textLine}>{item.title}</Text>
          <Text
            style={[
              styles.firstTextLine,
              {color: isDateValid ? colors.royalBlue : colors.guardsmanRed},
            ]}>
            {t('homeScreen.licenseValid', {validDays, validTo})}
          </Text>
          {item.data.type === 0 && (
            <Text style={styles.textLine}>
              {t('companyDetailsScreen.balance', {balance: item.data.agBalance})}
            </Text>
          )}
          {item.data.type === 0 && (
            <Text
              style={
                styles.textLine
              }>{t('companyDetailsScreen.smsBalance', {smsBalance: item.data.smsBalance})}</Text>
          )}
          {item.data.type === 0 && (
            <Button
              style={styles.button}
              icon="license"
              mode="outlined"
              onPress={() => {
                const newLicense = new CreateKhymkorLicenseModel();
                dispatch(ActionCreators.handleRenewKhymcorLicense(newLicense));
              }}>
              {t('homeScreen.renewLicenseText')}
            </Button>
          )}
        </View>
      </ScrollView>
    );
};

export default CompanyDetailsScreen;
