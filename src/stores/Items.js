import { defineStore, storeToRefs } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import { useRoomsStore } from '@/stores/Rooms';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

const roomsStore = useRoomsStore();
const { chosenRoom } = storeToRefs(roomsStore);

export const useItemsStore = defineStore('items', {
    state: () => ({
        items: [],
        fetching: false,
        chosenItem: {},
        item: {},
        submitting: false,
        error: ''
    }),
    getters: {},
    actions: {
        async fetch(roomObjectId) {
            const Items = Parse.Object.extend('items');
            const query = new Parse.Query(Items);

            const room = new Parse.Object('rooms');
            room.id = roomObjectId;
            query.equalTo('room', room);

            try {
                this.fetching = true;
                this.items = await query.find();
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching items:', error);
                throw error;
            }
        },
        async updateItem() {
            const item = new Parse.Object('items');
            const stock = Number(this.chosenItem.stock);
            const maximumStock = Number(this.chosenItem.maximumStock);
            const unitId = this.chosenItem.unit.value || this.chosenItem.unit;

            item.set('objectId', this.chosenItem.id);
            item.set('stock', stock);
            item.set('maximumStock', maximumStock);
            item.set('name', this.chosenItem.name);
            item.set('description', this.chosenItem.description);

            const Unit = Parse.Object.extend('units');
            const unitPointer = new Unit();

            unitPointer.id = unitId;
            item.set('unit', unitPointer);

            try {
                this.resetError();
                this.submitting = true;
                await item.save();
                this.submitting = false;
                this.fetch(chosenRoom.value.id);
                this.resetChosenItem();
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async createItem() {
            const item = new Parse.Object('items');
            const stock = Number(this.item.stock);
            const maximumStock = Number(this.item.maximumStock);
            const unitId = this.item.unit.value || this.item.unit;

            item.set('stock', stock);
            item.set('maximumStock', maximumStock);
            item.set('name', this.item.name);
            item.set('description', this.item.description);

            const Unit = Parse.Object.extend('units');
            const unitPointer = new Unit();

            unitPointer.id = unitId;
            item.set('unit', unitPointer);

            const Room = Parse.Object.extend('rooms');
            const roomPointer = new Room();

            roomPointer.id = chosenRoom.value.id;
            item.set('room', roomPointer);

            try {
                this.resetError();
                this.submitting = true;
                await item.save();
                this.submitting = false;
                this.fetch(chosenRoom.value.id);
                this.resetItemForm();
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async deleteItem() {
            const Item = Parse.Object.extend('items');
            const item = new Item();
            item.id = this.chosenItem.id;

            try {
                this.resetError();
                this.submitting = true;
                await item.destroy();
                this.submitting = false;
                await this.fetch(chosenRoom.value.id);
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        setChosenItem(item) {
            this.chosenItem = {
                id: item.id,
                ...item.attributes,
                unit: {
                    value: item.attributes.unit.id,
                    title: item.attributes.unit.attributes.technical_label
                }
            };
        },
        resetItemForm() {
            this.item = {};
        },
        resetChosenItem() {
            this.chosenItem = {};
        },
        resetError() {
            this.error = '';
        }
    }
});
