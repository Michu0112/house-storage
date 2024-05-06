<script setup>
import { Icon } from '@iconify/vue';
import { useHousesStore } from '@/stores/Houses';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import EditHouse from '@/components/modals/houses/EditHouse.vue';
import DeleteHouse from '@/components/modals/houses/DeleteHouse.vue';
import Loader from '@/components/utils/Loader.vue';

const props = defineProps({
    crud: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['chosen']);

const store = useHousesStore();
const { houses, fetching } = storeToRefs(store);

const editModal = ref(false);
const deleteModal = ref(false);
const { mdAndDown } = useDisplay();

const modalsMap = {
    delete: deleteModal,
    edit: editModal
};

const openModal = (modal, house) => {
    store.setChosenHouse(house);
    modalsMap[modal].value = true;
};

const closeModal = (modal) => {
    modalsMap[modal].value = false;
};

const pickHouse = (id) => {
    if (!props.crud) {
        emit('chosen', id);
    }
    store.chooseHouse(id, props.crud);
};

store.fetchAll();
</script>

<template>
    <v-container>
        <h1 v-if="crud" class="d-flex align-center ga-3 mb-3">
            <span>Domy</span>
        </h1>
        <Loader :show-content="!fetching" type="circle">
            <v-row v-if="houses.length > 0">
                <v-col cols="12" :md="crud ? 4 : 12" v-for="house in houses" :key="house.id">
                    <v-card
                        @click="pickHouse(house.id)"
                        class="house-card d-flex justify-space-between align-center pa-3"
                        :class="{
                            'desktop-only': !mdAndDown
                        }"
                        color="secondary"
                        variant="outlined"
                    >
                        <div class="d-flex align-center w-100">
                            <Icon
                                class="door-icon mr-1"
                                icon="fa6-solid:house-chimney"
                                :style="{ fontSize: '20px', color: '#00BD7E' }"
                            />
                            <span class="text-body-1 font-weight-bold">
                                {{ house.attributes.name }}
                            </span>
                        </div>

                        <template v-if="crud">
                            <v-btn
                                @click.stop="openModal('edit', house)"
                                variant="plain"
                                size="x-small"
                            >
                                <Icon
                                    class="edit-icon"
                                    icon="clarity:edit-solid"
                                    :style="{ fontSize: '20px', color: '#ebebeba3' }"
                                />
                            </v-btn>

                            <v-btn @click.stop="openModal('delete', house)" variant="plain">
                                <Icon
                                    class="trash-icon"
                                    icon="ph:trash-bold"
                                    :style="{ fontSize: '20px', color: '#D72424' }"
                                />
                            </v-btn>
                        </template>
                    </v-card>
                </v-col>
            </v-row>

            <p v-else>Brak domów.</p>
        </Loader>
    </v-container>

    <EditHouse v-model="editModal" @close="closeModal('edit')" />
    <DeleteHouse v-model="deleteModal" @close="closeModal('delete')" />
</template>

<style scoped lang="scss">
.house-card.desktop-only {
    & .trash-icon,
    & .edit-icon {
        transition: 0.5s;
        display: none !important;
    }
    &:hover {
        background-color: #00bd7e;
        & .door-icon {
            color: #ebebeba3 !important;
        }

        & .trash-icon,
        & .edit-icon {
            display: block !important;
            color: #d72424;
        }
    }
}
</style>
