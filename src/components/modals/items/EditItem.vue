<script setup>
import { computed, ref } from 'vue';
import { useItemsStore } from '@/stores/Items';
import { useRoomsStore } from '@/stores/Rooms';
import { useUnitsStore } from '@/stores/Units';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { required, maxLength, maxValue, minValue } from '@/utils/i18n/i18n-validators';
import { useVuelidate } from '@vuelidate/core';

import Modal from '@/components/Modal.vue';
import Loader from '@/components/utils/Loader.vue';
import Error from '@/components/utils/Error.vue';

const props = defineProps({
    fields: {
        type: Array,
        default: () => []
    }
});

const store = useItemsStore();
const unitsStore = useUnitsStore();
const roomsStore = useRoomsStore();

const emit = defineEmits(['close', 'updated']);
const { chosenItem, submitting, error } = storeToRefs(store);
const { units } = storeToRefs(unitsStore);
const { chosenRoom } = storeToRefs(roomsStore);
const step = ref(1);

const submit = async () => {
    v$.value.$validate();

    if (!v$.value.$error) {
        try {
            await store.updateItem(chosenRoom.value?.id);
            emit('updated');
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

const v$ = useVuelidate(rules, chosenItem);

const close = () => {
    v$.value.$reset();
    emit('close');
};

const setStockStep = (v) => {
    const unit = units.value.filter((unit) => unit.id === v);
    step.value = unit[0].attributes.step || 1;
};

const title = computed(() => {
    const itemName = chosenItem.value?.name;
    return 'Edytuj stan: ' + (itemName ? itemName : '');
});

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

const allowedFields = computed(() => {
    return {
        name: props.fields.includes('name'),
        stock: props.fields.includes('stock'),
        maximumStock: props.fields.includes('maximumStock'),
        unit: props.fields.includes('unit'),
        description: props.fields.includes('description')
    };
});
</script>

<template>
    <Modal :title="title">
        <template #modalContentSlot>
            <v-row>
                <v-col>
                    <v-form id="updateItem" @submit.prevent="submit">
                        <v-row v-show="allowedFields.name">
                            <v-col>
                                <span>Aktualizuj nazwę:</span>
                                <v-text-field
                                    variant="outlined"
                                    v-model="chosenItem.name"
                                    hide-details
                                />
                                <Error
                                    v-for="(e, i) in v$.name?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <div class="mt-3" v-show="allowedFields.stock">
                            <v-row>
                                <v-col>
                                    <span>Aktualizuj ilość:</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col align-self="center" class="d-flex justify-center">
                                    <v-btn @click="chosenItem.stock -= step">
                                        <Icon
                                            icon="ph:minus-fill"
                                            color="primary"
                                            :style="{ fontSize: '20px', color: '#00BD7E' }"
                                        />
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="chosenItem.stock"
                                        :step="step"
                                        type="number"
                                        class="number-input"
                                        variant="outlined"
                                        hide-details
                                    />
                                </v-col>
                                <v-col align-self="center" class="d-flex justify-center">
                                    <v-btn @click="chosenItem.stock += step">
                                        <Icon
                                            icon="ph:plus-fill"
                                            color="primary"
                                            :style="{ fontSize: '20px', color: '#00BD7E' }"
                                        />
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <Error
                                        v-for="(e, i) in v$.stock?.$errors"
                                        :error="e.$message"
                                        :key="i"
                                        class="mt-1"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                        <div class="mt-3" v-show="allowedFields.maximumStock">
                            <v-row>
                                <v-col>
                                    <span>Aktualizuj żądaną ilość:</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col align-self="center" class="d-flex justify-center">
                                    <v-btn @click="chosenItem.maximumStock -= step">
                                        <Icon
                                            icon="ph:minus-fill"
                                            color="primary"
                                            :style="{ fontSize: '20px', color: '#00BD7E' }"
                                        />
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="chosenItem.maximumStock"
                                        :step="step"
                                        type="number"
                                        class="number-input"
                                        variant="outlined"
                                        hide-details
                                    />
                                </v-col>
                                <v-col align-self="center" class="d-flex justify-center">
                                    <v-btn @click="chosenItem.maximumStock += step">
                                        <Icon
                                            icon="ph:plus-fill"
                                            color="primary"
                                            :style="{ fontSize: '20px', color: '#00BD7E' }"
                                        />
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <Error
                                        v-for="(e, i) in v$.maximumStock?.$errors"
                                        :error="e.$message"
                                        :key="i"
                                        class="mt-1"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                        <v-row v-show="allowedFields.unit">
                            <v-col>
                                <span>Aktualizuj jednostkę:</span>
                                <v-autocomplete
                                    @update:model-value="setStockStep"
                                    v-model="chosenItem.unit"
                                    :items="formattedUnits"
                                    hide-details
                                />
                                <Error
                                    v-for="(e, i) in v$.unit?.$errors"
                                    :error="e.$message"
                                    :key="i"
                                    class="mt-1"
                                />
                            </v-col>
                        </v-row>

                        <v-row v-show="allowedFields.description">
                            <v-col>
                                <span>Aktualizuj opis:</span>
                                <v-textarea v-model="chosenItem.description" hide-details />
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
                    <v-btn @click="close()" color="danger" class="w-100" :ripple="false">Anuluj</v-btn>
                </v-col>
                <v-col cols="6" class="py-0">
                    <v-btn form="updateItem" type="submit" color="primary" :ripple="false" class="w-100">
                        <Loader :show-content="!submitting" type="circle" color="white">
                            Zapisz
                        </Loader>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>
