import { defineStore } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import { createOptions } from '@/components/utils/CreateOptions';
import { useHousesStore } from './Houses';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

export const useOptionsStore = defineStore('options', {
    state: () => ({
        rooms: {
            options: [],
            total: 0,
            page: 1,
            itemsPerPage: 15,
            loading: false,
            search: ''
        }
    }),
    getters: {
        chosenHouse() {
            const user = useHousesStore();
            return user.chosenHouse;
        }
    },
    actions: {
        async fetchRoomsOptions() {
            const Room = Parse.Object.extend('rooms');
            const query = new Parse.Query(Room);

            const house = new Parse.Object('house');
            house.id = this.chosenHouse.id;
            query.equalTo('house', house);

            try {
                this.rooms.loading = true;
                const rooms = await query.find();
                this.rooms.options.push(...createOptions(this.rooms.options, rooms, 'name', 'id'));

                this.rooms.loading = false;
            } catch (err) {
                this.rooms.loading = false;
                console.log(err);
                return err;
            }
        }
    }
});
