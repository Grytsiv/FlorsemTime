import React from 'react';
import {View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import moment from 'moment/moment';
import {ICompanyResponse} from '../../models/ICreateLicenseModel.ts';
import colors from '../../theme/colors.ts';
import styles from './styles';

interface ICompanyCard {
    item: ICompanyResponse;
    onPress: () => void;
}

const CompanyCard: React.FC<ICompanyCard> = ({item, onPress}) => {
    const {title, data} = item;
    const {t} = useTranslation();
    const now = new Date().valueOf();
    const companyValidToDate =
      data.type === 0 ?
        new Date(moment().endOf('month').toDate()).valueOf() :
        new Date(moment(now).add(data.daysRemained + 1, 'days').toDate()).valueOf();
    const isDateValid =
      data.type === 0 ?
        data.agBalance >= 0 && data.smsBalance >= 0 :
        data.daysRemained >= 0;
    const validDays = Math.floor(moment.duration(companyValidToDate - now).asDays());
    return (
      <Card
        style={[
          styles.card,
          {borderColor: isDateValid ? colors.royalBlue : colors.guardsmanRed},
        ]}
        onPress={onPress}>
        <Card.Content>
          <View style={styles.rowHeader}>
            <Text style={styles.textFlex2}>{title}</Text>
            <View style={styles.rowWithIcon}>
              <Text numberOfLines={1} style={styles.textBold}>
                {moment.utc(companyValidToDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </View>
          <View style={[styles.rowHeader, styles.marginTop]}>
            <Text style={styles.textFlex2}>
              {companyValidToDate > now
                ? t('homeScreen.validUntil')
                : t('homeScreen.expired')}
            </Text>
            <View style={styles.rowWithText}>
              <Text
                numberOfLines={1}
                style={[
                  styles.textBold,
                  {color: isDateValid ? colors.royalBlue : colors.guardsmanRed},
                ]}>
                {validDays}
              </Text>
            </View>
          </View>
          {data.type === 0 && (
            <>
              <View style={[styles.rowHeader, styles.marginTop]}>
                <Text style={styles.textFlex2}>{t('homeScreen.balance')}</Text>
                <View style={styles.rowWithText}>
                  <Text numberOfLines={1} style={styles.textBold}>
                    {data.agBalance}
                  </Text>
                </View>
              </View>
              <View style={[styles.rowHeader, styles.marginTop]}>
                <Text style={styles.textFlex2}>
                  {t('homeScreen.smsBalance')}
                </Text>
                <View style={styles.rowWithText}>
                  <Text numberOfLines={1} style={styles.textBold}>
                    {data.smsBalance}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
};

export default CompanyCard;
