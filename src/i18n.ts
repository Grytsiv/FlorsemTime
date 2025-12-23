import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import RNLanguageDetector from './utils/rnLanguageDetector.ts';
import {registerTranslation, en as english} from 'react-native-paper-dates';

import en from './translations/en.json';
import uk from './translations/uk.json';

i18n
    .use(RNLanguageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            en: {
                translation: en,
            },
            uk: {
                translation: uk,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

registerTranslation('en', english);
export default i18n;
