<script setup>
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useHousesStore();
const emit = defineEmits(['close']);
const { chosenHouse, submitting, error } = storeToRefs(store);

const submit = async () => {
    try {
        await store.deleteHouse();
        close();
    } catch (err) {
        console.log(err);
    }
};

const close = () => {
    emit('close');
};

const title = computed(() => {
    return 'Usuwasz dom: ' + chosenHouse.value?.name;
});
</script>

<template>
    <Modal :title="title">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="deleteHouse" @submit.prevent="submit">
                        <span>Czy jesteś pewny?</span>
                    </v-form>
                </v-col>
            </v-row>
        </template>

        <template #modalContentActions>
            <v-row class="justify-end mb-3">
                <v-col cols="12" v-if="error">
                    <Error :error="error" class="text-left" />
                </v-col>

                <v-col cols="6" class="py-0">
                    <v-btn @click="close()" color="primary" class="w-100">Anuluj</v-btn>
                </v-col>
                <v-col cols="6" class="py-0">
                    <v-btn form="deleteHouse" type="submit" color="danger" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Usuń
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
