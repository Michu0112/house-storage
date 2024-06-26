<script setup>
import { useRoomsStore } from '@/stores/Rooms';
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { required, maxLength } from '@/utils/i18n/i18n-validators';
import { useVuelidate } from '@vuelidate/core';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useRoomsStore();
const housesStore = useHousesStore();

const emit = defineEmits(['close']);
const { chosenRoom, submitting, error } = storeToRefs(store);
const { chosenHouse } = storeToRefs(housesStore);

const submit = async () => {
    v$.value.$validate();

    if (!v$.value.$error) {
        try {
            await store.updateRoom(chosenHouse.value.id);
            close();
        } catch (err) {
            console.log(err);
        }
        return;
    }

    console.group('House edit validation errors');
    v$.value.$errors.forEach((error) => console.warn(error.$message));
    console.groupEnd();
};

const rules = {
    name: { required, maxLength: maxLength(20) }
};

const v$ = useVuelidate(rules, chosenRoom);

const close = () => {
    v$.value.$reset();
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
                        <v-text-field variant="outlined" v-model="chosenRoom.name" hide-details />
                        <Error
                            v-for="(e, i) in v$.name?.$errors"
                            :error="e.$message"
                            :key="i"
                            class="mt-1"
                        />
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
