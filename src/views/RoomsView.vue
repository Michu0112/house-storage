<script setup>
import { Icon } from '@iconify/vue';
import { useHousesStore } from '@/stores/Houses';
import { useRoomsStore } from '@/stores/Rooms';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import RoomsList from '@/components/RoomsList.vue';
import GoBack from '@/components/utils/GoBack.vue';
import Loader from '@/components/utils/Loader.vue';
import AddRoom from '@/components/modals/rooms/AddRoom.vue';

const housesStore = useHousesStore();
const store = useRoomsStore();

const { chosenHouse, fetching } = storeToRefs(housesStore);
const modal = ref(false);

const openModal = () => {
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
    store.resetRoomForm();
};

if (!chosenHouse.value) {
    housesStore.fetchHouseFromURL();
}
</script>

<template>
    <h1 class="d-flex align-center ga-3">
        <Loader :show-content="!fetching">
            <v-row>
                <v-col>
                    <div class="d-flex ga-3">
                        <GoBack
                            ><Icon
                                icon="fa6-solid:house-chimney"
                                color="primary"
                                :style="{ fontSize: '30px', color: '#00BD7E' }"
                            />
                        </GoBack>

                        <span class="">{{ chosenHouse.attributes?.name }}</span>
                    </div>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="openModal()" color="success" variant="outlined">
                        <Icon
                            class="door-icon mr-2"
                            icon="fluent:door-arrow-left-20-regular"
                            :style="{ fontSize: '30px', color: '#00BD7E' }"
                        />
                        <span>Dodaj pokój</span>
                    </v-btn>
                </v-col>
            </v-row>
        </Loader>
    </h1>
    <main class="mt-10">
        <RoomsList />
        <AddRoom v-model="modal" @close="closeModal" />
    </main>
</template>
