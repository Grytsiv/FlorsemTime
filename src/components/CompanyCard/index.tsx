import React from 'react';
import {View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import styles from './styles';
import {IMergedCompanyModel} from '../../models/ICompanyModel.ts';
import moment from 'moment/moment';
import colors from '../../theme/colors.ts';

interface ICompanyCard {
    item: IMergedCompanyModel;
    onPress: () => void;
}

const CompanyCard: React.FC<ICompanyCard> = ({item, onPress}) => {
    const {company, payment} = item;
    const now = new Date().valueOf();
    const companyValidToDate = new Date(moment(payment.StartDate).add(payment.Period + 1, 'days').toDate()).valueOf();
    const isDateValid = companyValidToDate > now;
    const validDays = Math.floor(moment.duration(companyValidToDate - now).asDays());
    return (
        <Card style={[styles.card, {borderColor: isDateValid ? colors.royalBlue : colors.guardsmanRed}]} onPress={onPress}>
            <Card.Content>
                <View style={styles.rowHeader}>
                    <Text style={styles.textFlex2}>
                        {company.Name}, ID:{company.Id}
                    </Text>
                    <View style={styles.rowWithIcon}>
                        <Text
                            numberOfLines={1}
                            style={styles.textBold}>
                            {payment.StartDate}
                        </Text>
                    </View>
                </View>
                <View style={[styles.rowHeader, styles.marginTop]}>
                    <Text style={styles.textFlex2}>
                        {company.Address}
                    </Text>
                    <View style={styles.rowWithText}>
                        <Text numberOfLines={1} style={styles.textBold}>
                            {payment.Period}
                        </Text>
                    </View>
                </View>
                <View style={styles.rowHeader}>
                    <Text style={styles.textFlex2}>
                        {company.Phone}
                    </Text>
                    <View style={styles.rowWithText}>
                        <Text
                            style={[
                                styles.textValue,
                                styles.marginHorizontal,
                            ]}>
                            {payment.CardOwnerName}
                        </Text>
                    </View>
                </View>
                <View style={[styles.rowHeader, styles.marginTop]}>
                    <Text style={styles.textFlex2}>
                        {company.Email}
                    </Text>
                    <View style={styles.rowWithText}>
                        <Text numberOfLines={1} style={[styles.textBold, {color: isDateValid ? colors.royalBlue : colors.guardsmanRed}]}>
                            {validDays}
                        </Text>
                    </View>
                </View>
                <Text style={[
                        styles.textRef,
                    ]}>
                    {company.CreatedDate}
                </Text>
                <Text
                    style={[
                        styles.textValue,
                    ]}>
                    {company.ModifiedDate}
                </Text>
            </Card.Content>
        </Card>
    );
};

export default CompanyCard;
