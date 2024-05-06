<script setup>
import { useItemsStore } from '@/stores/Items';
import { useRoomsStore } from '@/stores/Rooms';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useItemsStore();
const roomsStore = useRoomsStore();

const emit = defineEmits(['close']);
const { chosenItem, submitting, error } = storeToRefs(store);
const { chosenRoom } = storeToRefs(roomsStore);

const submit = async () => {
    try {
        await store.deleteItem(chosenRoom.value.id);
        close();
    } catch (err) {
        console.log(err);
    }
};

const close = () => {
    emit('close');
};

const title = computed(() => {
    return 'Usuwasz zasób: ' + chosenItem.value?.name;
});
</script>

<template>
    <Modal :title="title">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="deleteItem" @submit.prevent="submit">
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
                    <v-btn form="deleteItem" type="submit" color="danger" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Usuń
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
