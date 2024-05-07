<script setup>
import { useHousesStore } from '@/stores/Houses';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

import HousesList from '@/components/HousesList.vue';
import AddHouse from '@/components/modals/houses/AddHouse.vue';

const store = useHousesStore();
const modal = ref(false);

const openModal = () => {
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
    store.resetHouseForm();
};
</script>

<template>
    <h1 class="d-flex align-center ga-3">
        <v-row>
            <v-col>
                <span>Wybierz dom</span>
            </v-col>

            <v-col cols="12" md="auto">
                <v-btn @click="openModal()" color="success" variant="outlined">
                    <Icon
                        class="door-icon mr-2"
                        icon="mdi:house-plus-outline"
                        :style="{ fontSize: '30px', color: '#00BD7E' }"
                    />
                    <span>Dodaj dom</span>
                </v-btn>
            </v-col>
        </v-row>
    </h1>
    <main class="mt-5 mt-md-10">
        <HousesList />
        <AddHouse v-model="modal" @close="closeModal" />
    </main>
</template>
