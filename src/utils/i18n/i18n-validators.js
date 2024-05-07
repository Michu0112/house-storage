import * as validators from '@vuelidate/validators';
import { t } from '@/utils/i18n';
const { createI18nMessage } = validators;

const withI18nMessage = createI18nMessage({ t });

export const required = withI18nMessage(validators.required);
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true });
export const minValue = withI18nMessage(validators.minValue, { withArguments: true });
export const maxValue = withI18nMessage(validators.maxValue, { withArguments: true });
