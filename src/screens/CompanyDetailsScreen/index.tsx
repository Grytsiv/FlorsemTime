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
  route: {params: {id: number}};
};

const CompanyDetailsScreen: FC<ScreenProps> = ({route}) => {

    const {id} = route.params;
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const {paymentList} = useAppSelector(
      (state: TRootState) => state.homeReducer,
    );

    const targetItem: ICompanyResponse | undefined = paymentList.find(payment => payment.data.id === id);

    const item = targetItem!!;

    const now = new Date().valueOf();
    let companyValidToDate = new Date(moment().endOf('month').toDate()).valueOf();
    let isDateValid = false;
    if ('daysRemained' in item.data && item.data.type === 1) {
      companyValidToDate = new Date(
        moment(now)
          .add(item.data.daysRemained + 1, 'days')
          .toDate(),
      ).valueOf();
      isDateValid = item.data.daysRemained >= 0;
    } else if ('expirationDate' in item.data && item.data.type === 2) {
      companyValidToDate = new Date(
        moment(item.data.expirationDate).toDate(),
      ).valueOf();
      isDateValid = moment(item.data.expirationDate).valueOf() >= now;
    } else if (
      'agBalance' in item.data &&
      'smsBalance' in item.data &&
      item.data.type === 0
    ) {
      companyValidToDate = new Date(moment().endOf('month').toDate()).valueOf();
      isDateValid = item.data.agBalance >= 0 && item.data.smsBalance >= 0;
    }

    const validDays = Math.floor(
      moment.duration(companyValidToDate - now).asDays(),
    );

    const {isBusy} = useAppSelector(
        (state: TRootState) => state.appServiceReducer,
    );

    const onRefresh = React.useCallback(() => {
      dispatch(ActionCreators.handlePaymentList());
    }, [dispatch]);

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
            {t('homeScreen.licenseValid', {validDays, companyValidToDate})}
          </Text>
          {item.data.type === 0 && (
            <Text style={styles.textLine}>
              {t('companyDetailsScreen.balance', {
                balance: item.data.agBalance,
              })}
            </Text>
          )}
          {item.data.type === 0 && (
            <Text style={styles.textLine}>
              {t('companyDetailsScreen.smsBalance', {
                smsBalance: item.data.smsBalance,
              })}
            </Text>
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
