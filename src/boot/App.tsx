import React from 'react';
import {Appearance} from 'react-native';
import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import AppServiceWrapper from '../components/AppServiceWrapper';
import configureStore from './configureStore';
import NavigationCustomContainer from '../navigation/NavigationCustomContainer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  PaperThemeDark,
  PaperThemeDefault,
} from '../theme/theme-config';
import '../i18n';

const App: React.FC = () => {
  const initializedStore = configureStore();
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
  const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
      <SafeAreaProvider>
        <Provider store={initializedStore}>
          <I18nextProvider i18n={i18next}>
            <PaperProvider theme={paperTheme}>
              <AppServiceWrapper>
                <NavigationCustomContainer theme={combinedTheme} />
              </AppServiceWrapper>
            </PaperProvider>
          </I18nextProvider>
        </Provider>
      </SafeAreaProvider>
  );
};
export default App;
