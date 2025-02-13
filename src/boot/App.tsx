import React from 'react';
import {Appearance} from 'react-native';
import {Provider} from 'react-redux';
import store from './configureStore';
import {PaperProvider} from 'react-native-paper';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import AppServiceWrapper from '../components/AppServiceWrapper';
import NavigationCustomContainer from '../navigation/NavigationCustomContainer';
import {SENTRY_DSN, SERVER_URL} from '../config';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  PaperThemeDark,
  PaperThemeDefault,
} from '../theme/theme-config';
import '../i18n';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});
Sentry.setTag('environment.base_url', SERVER_URL);

const App: React.FC = () => {
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
  const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
      <SafeAreaProvider>
        <Provider store={store}>
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

export default Sentry.wrap(App);
