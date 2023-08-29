import I18n from 'react-native-i18n'
import en from './locales/en'
import zhHant from './locales/zh-Hant'
import zhHans from './locales/zh-Hans'

I18n.fallbacks = true;
I18n.defaultLocale = 'en-US';

I18n.translations = {
  en,
  zhHant,
  zhHans
};

export default I18n;
