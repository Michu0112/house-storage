<script setup>
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useHousesStore();
const emit = defineEmits(['close']);
const { house, submitting, error } = storeToRefs(store);

const submit = async () => {
    try {
        await store.createHouse();
        close();
    } catch (err) {
        console.log(err);
    }
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Modal title="Dodajesz dom">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="createHouse" @submit.prevent="submit">
                        <span>Nazwa domu:</span>
                        <v-text-field variant="outlined" v-model="house.name" />
                    </v-form>
                </v-col>
            </v-row>
        </template>

        <template #modalContentActions>
            <v-row class="justify-end mb-3">
                <v-col cols="12">
                    <Error :error="error" v-if="error" class="text-left" />
                </v-col>

                <v-col cols="6" class="py-0">
                    <v-btn @click="close()" color="danger" class="w-100">Anuluj</v-btn>
                </v-col>
                <v-col cols="6" class="py-0">
                    <v-btn form="createHouse" type="submit" color="primary" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Dodaj
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
