<script setup>
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength } from '@/utils/i18n/i18n-validators';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useHousesStore();
const emit = defineEmits(['close']);
const { house, submitting, error } = storeToRefs(store);

const submit = async () => {
    v$.value.$validate();

    if (!v$.value.$error) {
        try {
            await store.createHouse();
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

const v$ = useVuelidate(rules, house);

const close = () => {
    v$.value.$reset();
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
                        <v-text-field variant="outlined" v-model="house.name" hide-details />
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
                    <v-btn @click="close()" color="danger" class="w-100" :ripple="false">Anuluj</v-btn>
                </v-col>
                <v-col cols="6" class="py-0">
                    <v-btn form="createHouse" type="submit" color="primary" class="w-100" :ripple="false">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Dodaj
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
