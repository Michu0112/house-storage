import { defineStore } from 'pinia';
import Parse from 'parse/dist/parse.min.js';
import { useRoute } from 'vue-router';
import router from '@/router';

Parse.initialize(
    '3q3BRfqp3r9kySxm2DXdORLl8QKVMNmKtSR3xXjH',
    'z8EGOZDDM2XUEzKOCxxBXkidw3WB8lDmczydYuMB'
);
Parse.serverURL = 'https://parseapi.back4app.com/parse';

export const useRoomsStore = defineStore('rooms', {
    state: () => ({
        rooms: [],
        fetching: false,
        submitting: false,
        chosenRoom: null,
        room: {},
        error: ''
    }),
    getters: {},
    actions: {
        async fetch(houseObjectId) {
            const Room = Parse.Object.extend('rooms');
            const query = new Parse.Query(Room);

            const house = new Parse.Object('house');
            house.id = houseObjectId;
            query.equalTo('house', house);

            try {
                this.fetching = true;
                this.rooms = await query.find();
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching rooms:', error);
                throw error;
            }
        },
        async fetchRoomFromURL() {
            const route = useRoute();
            const roomObjectId = route.params.roomId;

            const Room = Parse.Object.extend('rooms');
            const query = new Parse.Query(Room);

            query.equalTo('objectId', roomObjectId);

            try {
                this.fetching = true;
                const response = await query.find();
                this.chosenRoom = response[0];
                this.fetching = false;
            } catch (error) {
                console.error('Error fetching houses:', error);
                throw error;
            }
        },
        async createRoom(houseObjectId) {
            const Room = Parse.Object.extend('rooms');
            const room = new Room();

            room.set('name', this.room.name);

            const House = Parse.Object.extend('house');
            const housePointer = new House();
            housePointer.id = houseObjectId;
            room.set('house', housePointer);

            try {
                this.resetError();
                this.submitting = true;
                await room.save();
                this.submitting = false;
                this.fetch(houseObjectId);
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async updateRoom(houseObjectId) {
            const Room = Parse.Object.extend('rooms');
            const room = new Room();

            room.set('objectId', this.chosenRoom.id);
            room.set('name', this.chosenRoom.name);

            try {
                this.resetError();
                this.submitting = true;
                await room.save();
                this.submitting = false;
                this.resetChosenRoom();
                this.fetch(houseObjectId);
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        async deleteRoom(houseObjectId) {
            const Room = Parse.Object.extend('rooms');
            const room = new Room();
            room.id = this.chosenRoom.id;

            try {
                this.resetError();
                this.submitting = true;
                await room.destroy();
                this.submitting = false;
                await this.fetch(houseObjectId);
            } catch (err) {
                this.submitting = false;
                this.error = err.message;
                throw err;
            }
        },
        setChosenRoom(room) {
            this.chosenRoom = {
                id: room.id,
                ...room.attributes
            };
        },
        chooseRoom(id) {
            this.chosenRoom = this.rooms.filter((room) => room.id === id)[0];
            router.push({ name: 'items', params: { roomId: id } });
        },
        resetChosenRoom() {
            this.chosenRoom = {};
        },
        resetRoomForm() {
            this.room = {};
        },
        resetError() {
            this.error = '';
        }
    }
});
