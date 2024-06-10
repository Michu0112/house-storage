<script setup>
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';

import Modal from '@/components/Modal.vue';
import Error from '@/components/utils/Error.vue';
import HousesList from '@/components/HousesList.vue';

const store = useHousesStore();
const emit = defineEmits(['close']);
const { error } = storeToRefs(store);

const chooseAndClose = (v) => {
    localStorage.setItem('chosenHouseId', v);
    close();
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Modal title="Wybierz dom">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <HousesList :crud="false" @chosen="chooseAndClose" />
                </v-col>
            </v-row>
        </template>

        <template #modalContentActions>
            <v-row class="justify-end mb-3">
                <v-col cols="12" v-if="error">
                    <Error :error="error" class="text-left" />
                </v-col>

                <v-col cols="12" class="py-0">
                    <v-btn @click="close()" color="danger" class="w-100" :ripple="false">Anuluj</v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
