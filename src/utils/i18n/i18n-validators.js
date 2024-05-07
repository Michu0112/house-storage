import * as validators from '@vuelidate/validators';
import { t } from '@/utils/i18n';
const { createI18nMessage } = validators;

const withI18nMessage = createI18nMessage({ t });

export const required = withI18nMessage(validators.required);
