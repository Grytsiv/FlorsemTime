import {type LanguageDetectorModule} from 'i18next';
import {getLocales} from 'react-native-localize';

const RNLanguageDetector: LanguageDetectorModule = {
    type: 'languageDetector',
    init: () => {},
    detect: () => getLocales()[0].languageCode,
    cacheUserLanguage: () => {},
};

export default RNLanguageDetector;
