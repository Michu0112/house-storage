<script setup>
import { useRoomsStore } from '@/stores/Rooms';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useRoomsStore();
const emit = defineEmits(['close']);
const { chosenRoom, submitting, error } = storeToRefs(store);

const submit = async () => {
    try {
        await store.updateRoom();
        close();
    } catch (err) {
        console.log(err);
    }
};

const close = () => {
    emit('close');
};

const title = computed(() => {
    return 'Edytujesz pokój: ' + chosenRoom.value?.name;
});
</script>

<template>
    <Modal :title="title">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="updateRoom" @submit.prevent="submit">
                        <span>Aktualizuj nazwę:</span>
                        <v-text-field variant="outlined" v-model="chosenRoom.name" />
                    </v-form>
                </v-col>
            </v-row>
        </template>

        <template #modalContentActions>
            <v-row class="justify-end mb-3">
                <v-col cols="6">
                    <Error :error="error" v-if="error" class="text-left" />
                </v-col>

                <v-col cols="3" class="py-0">
                    <v-btn @click="close()" color="primary" class="w-100">Anuluj</v-btn>
                </v-col>
                <v-col cols="3" class="py-0">
                    <v-btn form="updateRoom" type="submit" color="danger" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Zapisz
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
