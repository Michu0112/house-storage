<script setup>
import { computed, ref } from 'vue';
import { useItemsStore } from '@/stores/Items';
import { useRoomsStore } from '@/stores/Rooms';
import { useUnitsStore } from '@/stores/Units';
import { storeToRefs } from 'pinia';

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
    try {
        await store.updateItem(chosenRoom.value?.id);
        emit('updated');
        close();
    } catch (err) {
        console.log(err);
    }
};

const close = () => {
    emit('close');
};

const setStockStep = (v) => {
    const unit = units.value.filter((unit) => unit.id === v);
    step.value = unit[0].attributes.step || 1;
};

const title = computed(() => {
    return 'Edytuj stan: ' + chosenItem.value?.name;
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
                        <div v-show="allowedFields.name">
                            <span>Aktualizuj nazwę:</span>
                            <v-text-field variant="outlined" v-model="chosenItem.name" />
                        </div>

                        <div v-show="allowedFields.stock">
                            <span>Aktualizuj ilość:</span>
                            <v-text-field
                                type="number"
                                variant="outlined"
                                v-model="chosenItem.stock"
                                :step="step"
                            />
                        </div>
                        <div v-show="allowedFields.maximumStock">
                            <span>Aktualizuj żądaną ilość:</span>
                            <v-text-field
                                type="number"
                                variant="outlined"
                                v-model="chosenItem.maximumStock"
                                :step="step"
                            />
                        </div>
                        <div v-show="allowedFields.unit">
                            <span>Aktualizuj jednostkę:</span>
                            <v-autocomplete
                                @update:model-value="setStockStep"
                                v-model="chosenItem.unit"
                                :items="formattedUnits"
                            >
                            </v-autocomplete>
                        </div>
                        <div v-show="allowedFields.description">
                            <span>Aktualizuj opis:</span>
                            <v-textarea v-model="chosenItem.description" />
                        </div>
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
