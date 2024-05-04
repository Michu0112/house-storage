import { defineStore } from 'pinia';
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

export const useUnitsStore = defineStore('units', {
    state: () => ({ units: [] }),
    getters: {},
    actions: {
        async fetch() {
            const Units = Parse.Object.extend('units');
            const query = new Parse.Query(Units);

            try {
                this.fetching = true;
                this.units = await query.find();
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching units:', error);
                throw error;
            }
        }
    }
});
