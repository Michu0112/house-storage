import { defineStore } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import router from '@/router';
import { useRoute } from 'vue-router';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

export const useHousesStore = defineStore('houses', {
    state: () => ({
        houses: [],
        fetching: false,
        chosenHouse: {},
        house: {},
        error: '',
        submitting: false
    }),
    getters: {},
    actions: {
        async fetchAll() {
            const House = Parse.Object.extend('house');
            const query = new Parse.Query(House);

            try {
                this.fetching = true;
                this.houses = await query.find();
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching houses:', error);
                throw error;
            }
        },
        async fetchHouseFromURL() {
            const route = useRoute();
            const houseObjectId = route.params.houseId;

            const House = Parse.Object.extend('house');
            const query = new Parse.Query(House);

            query.equalTo('objectId', houseObjectId);

            try {
                this.fetching = true;
                const response = await query.find();
                this.chosenHouse = response[0];
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching houses:', error);
                throw error;
            }
        },
        async createHouse() {
            const House = Parse.Object.extend('house');
            const house = new House();

            house.set('name', this.house.name);

            try {
                this.resetError();
                this.submitting = true;
                await house.save();
                this.submitting = false;
                this.fetchAll();
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async updateHouse() {
            const House = Parse.Object.extend('house');
            const house = new House();

            house.set('objectId', this.chosenHouse.id);
            house.set('name', this.chosenHouse.name);

            try {
                this.resetError();
                this.submitting = true;
                await house.save();
                this.submitting = false;
                this.resetChosenHouse();
                this.fetchAll();
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async deleteHouse() {
            const House = Parse.Object.extend('house');
            const house = new House();
            house.id = this.chosenHouse.id;

            try {
                this.resetError();
                this.submitting = true;
                await house.destroy();
                this.submitting = false;
                await this.fetchAll();
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        setChosenHouse(house) {
            this.chosenHouse = {
                id: house.id,
                ...house.attributes
            };
        },
        chooseHouse(id, goToEdit) {
            this.chosenHouse = this.houses.filter((house) => house.id === id)[0];

            if (goToEdit) {
                router.push({ name: 'rooms', params: { houseId: id } });
            }
        },
        resetChosenHouse() {
            this.chosenHouse = {};
        },
        resetHouseForm() {
            this.house = {};
        },
        resetError() {
            this.error = '';
        }
    }
});
