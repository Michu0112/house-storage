import { defineStore } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import { useHousesStore } from './Houses';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

export const useStatisticsStore = defineStore('statistics', {
    state: () => ({
        statistics: [],
        fetching: false,
        search: '',
        filters: {
            roomId: ''
        }
    }),
    getters: {
        chosenHouse() {
            const user = useHousesStore();
            return user.chosenHouse;
        }
    },
    actions: {
        async fetchStatistics() {
            const Item = Parse.Object.extend('items');
            const Room = Parse.Object.extend('rooms');

            const roomQuery = new Parse.Query(Room);

            const house = new Parse.Object('house');
            house.id = this.chosenHouse.id;

            roomQuery.equalTo('house', house);

            const itemQuery = new Parse.Query(Item);

            if (this.filters.roomId) {
                roomQuery.equalTo('objectId', this.filters.roomId);
            }

            itemQuery.matchesQuery('room', roomQuery);

            itemQuery.include('unit');

            if (this.search) {
                itemQuery.matches('name', this.search, 'i');
            }

            try {
                this.fetching = true;
                const stats = await itemQuery.find();

                stats.forEach((stat) => {
                    const stock = stat.get('stock');
                    const maximumStock = stat.get('maximumStock');
                    const availabilityRatio = stock / maximumStock;
                    stat.availabilityRatio = availabilityRatio;
                });

                stats.sort((a, b) => a.availabilityRatio - b.availabilityRatio);

                this.statistics = stats;
                this.fetching = false;
            } catch (error) {
                this.fetching = false;
                console.error('Error fetching statistics:', error);
                throw error;
            }
        },
        setRoomFilter(v) {
            this.filters.roomId = v;
            this.fetchStatistics();
        },
        resetError() {
            this.error = '';
        }
    }
});
