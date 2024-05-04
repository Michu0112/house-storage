<script setup>
import { Icon } from '@iconify/vue';
import { useRoomsStore } from '@/stores/Rooms';
import { useItemsStore } from '@/stores/Items';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import ItemsList from '@/components/ItemsList.vue';
import GoBack from '@/components/utils/GoBack.vue';
import Loader from '@/components/utils/Loader.vue';
import AddItem from '@/components/modals/items/AddItem.vue';

const store = useItemsStore();
const roomsStore = useRoomsStore();

const { chosenRoom, fetching } = storeToRefs(roomsStore);
const modal = ref(false);

const openModal = () => {
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
    store.resetItemForm();
};

if (!chosenRoom.value) {
    roomsStore.fetchRoomFromURL();
}
</script>

<template>
    <h1 class="d-flex align-center ga-3">
        <Loader :show-content="!fetching">
            <v-row>
                <v-col>
                    <div class="d-flex ga-3">
                        <GoBack>
                            <Icon
                                icon="fluent:door-20-regular"
                                color="primary"
                                :style="{ fontSize: '30px', color: '#00BD7E' }"
                            />
                        </GoBack>

                        <span class="">{{ chosenRoom?.attributes.name }}</span>
                    </div>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="openModal()" color="success" variant="outlined">
                        <Icon
                            class="door-icon mr-2"
                            icon="tabler:cube-plus"
                            :style="{ fontSize: '30px', color: '#00BD7E' }"
                        />
                        <span>Dodaj zasób</span>
                    </v-btn>
                </v-col>
            </v-row>
        </Loader>
    </h1>
    <main class="mt-10">
        <ItemsList />
        <AddItem v-model="modal" @close="closeModal" />
    </main>
</template>
