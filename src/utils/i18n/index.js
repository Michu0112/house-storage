import { pl_key, pl_dictionary, en_key, en_dictionary } from '@/utils/i18n/locales';
import { createI18n } from 'vue-i18n';

const DEFAULT_LOCALE = pl_key;

export const i18n = createI18n({
    legacy: false,
    fallbackLocale: DEFAULT_LOCALE,
    locale: DEFAULT_LOCALE,
    globalInjection: true,
    messages: {
        [pl_key]: pl_dictionary,
        [en_key]: en_dictionary
    }
});

export const languages = {
    [pl_key]: pl_dictionary.languages[pl_key],
    [en_key]: en_dictionary.languages[en_key]
};

export const { t } = i18n.global;
