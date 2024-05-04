import { createVuetify } from 'vuetify';
import { components } from '@/vuetify/components';
import { theme } from '@/vuetify/theme';
import { directives } from '@/vuetify/directives';
import { pl } from 'vuetify/locale';

export const useVuetify = () =>
    createVuetify({
        theme,
        components,
        directives,
        locale: {
            locale: 'pl',
            fallback: 'pl',
            messages: { pl }
        }
    });
