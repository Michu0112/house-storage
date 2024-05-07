<script setup>
import { computed, ref } from 'vue';
import { useItemsStore } from '@/stores/Items';
import { useRoomsStore } from '@/stores/Rooms';
import { useUnitsStore } from '@/stores/Units';
import { storeToRefs } from 'pinia';
import { required, maxLength, maxValue, minValue } from '@/utils/i18n/i18n-validators';
import { useVuelidate } from '@vuelidate/core';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const store = useItemsStore();
const unitsStore = useUnitsStore();
const roomsStore = useRoomsStore();

const emit = defineEmits(['close']);
const { item, submitting, error } = storeToRefs(store);
const { units } = storeToRefs(unitsStore);
const { chosenRoom } = storeToRefs(roomsStore);
const step = ref(1);

const submit = async () => {
    v$.value.$validate();

    if (!v$.value.$error) {
        try {
            await store.createItem(chosenRoom.value.id);
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
    name: { required, maxLength: maxLength(20) },
    stock: { required, maxValue: maxValue(1000), minValue: minValue(0) },
    maximumStock: { required, maxValue: maxValue(1000), minValue: minValue(0) },
    unit: { required }
};

const v$ = useVuelidate(rules, item);

const close = () => {
    v$.value.$reset();
    emit('close');
};

const setStockStep = (v) => {
    const unit = units.value.filter((unit) => unit.id === v);
    step.value = unit[0].attributes.step || 1;
};

const formattedUnits = computed(() => {
    const formatted = units.value.map((unit) => {
        return {
            title: unit.attributes.technical_label,
            value: unit.id,
            step: unit.attributes.step
        };
    });

    return formatted;
});
</script>

<template>
    <Modal title="Dodajesz zasób">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="updateItem" @submit.prevent="submit">
                        <v-row>
                            <v-col>
                                <span>Podaj nazwę:</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field variant="outlined" v-model="item.name" hide-details />
                                <Error
                                    v-for="(e, i) in v$.name?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <span>Podaj ilość:</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                    type="number"
                                    variant="outlined"
                                    v-model="item.stock"
                                    :step="step"
                                    hide-details
                                />
                                <Error
                                    v-for="(e, i) in v$.stock?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <span>Podaj żądaną ilość:</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                    type="number"
                                    variant="outlined"
                                    v-model="item.maximumStock"
                                    :step="step"
                                    hide-details
                                />
                                <Error
                                    v-for="(e, i) in v$.maximumStock?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <span>Określ jednostkę:</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-autocomplete
                                    @update:model-value="setStockStep"
                                    v-model="item.unit"
                                    :items="formattedUnits"
                                    hide-details
                                ></v-autocomplete>
                                <Error
                                    v-for="(e, i) in v$.unit?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <span>Dodaj opis:</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-textarea v-model="item.description" />
                            </v-col>
                        </v-row>
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
                    <v-btn @click="close()" color="danger" class="w-100">Anuluj</v-btn>
                </v-col>
                <v-col cols="6" class="py-0">
                    <v-btn form="updateItem" type="submit" color="primary" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Zapisz
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
