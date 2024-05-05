<script setup>
import { computed, ref } from 'vue';
import { useItemsStore } from '@/stores/Items';
import { useRoomsStore } from '@/stores/Rooms';
import { useUnitsStore } from '@/stores/Units';
import { storeToRefs } from 'pinia';

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
    try {
        await store.createItem(chosenRoom.value.id);
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
                        <span>Podaj nazwę:</span>
                        <v-text-field variant="outlined" v-model="item.name" />

                        <span>Podaj ilość:</span>
                        <v-text-field
                            type="number"
                            variant="outlined"
                            v-model="item.stock"
                            :step="step"
                        />

                        <span>Podaj żądaną ilość:</span>
                        <v-text-field
                            type="number"
                            variant="outlined"
                            v-model="item.maximumStock"
                            :step="step"
                        />

                        <span>Określ jednostkę:</span>
                        <v-autocomplete
                            @update:model-value="setStockStep"
                            v-model="item.unit"
                            :items="formattedUnits"
                        >
                        </v-autocomplete>

                        <span>Dodaj opis:</span>
                        <v-textarea v-model="item.description" />
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
