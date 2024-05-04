import './assets/main.css';
import 'vuetify/styles';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import { useVuetify } from '@/vuetify';

import App from './App.vue';
import router from './router';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

const app = createApp(App);
const vuetify = useVuetify();

app.provide('Parse', Parse);
app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount('#app');
