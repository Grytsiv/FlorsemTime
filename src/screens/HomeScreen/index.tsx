import React from 'react';
import {FlatList, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {ICompanyResponse} from '../../models/ICreateLicenseModel.ts';
import {TRootState} from '../../boot/configureStore.ts';
import {useAppDispatch, useAppSelector} from '../../boot/hooks';
import CompanyCard from '../../components/CompanyCard';
import ActionCreators from '../../actions';
import styles from './styles';

type ScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<ScreenProps> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const {isBusy} = useAppSelector(
    (state: TRootState) => state.appServiceReducer,
  );
  const {paymentList} = useAppSelector(
    (state: TRootState) => state.homeReducer,
  );

  const handleCardPress = (item: ICompanyResponse) => {
    navigation.navigate('CompanyDetailsScreen', {id: item.data.id});
  };

  const onRefresh = React.useCallback(() => {
    dispatch(ActionCreators.handlePaymentList());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentOffset={{y: isBusy ? -60 : 0, x: 0}} // <-- if loading, set offset, this fix list shift after loading
        data={paymentList}
        keyExtractor={(item, index) =>
          item.data.type.toString() + index.toString()
        }
        refreshing={isBusy}
        onRefresh={onRefresh}
        contentContainerStyle={styles.contentContainer}
        scrollIndicatorInsets={styles.scrollIndicatorInsets}
        renderItem={({item}) => (
          <CompanyCard item={item} onPress={() => handleCardPress(item)} />
        )}
      />
    </View>
  );
};

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
