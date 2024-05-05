<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useItemsStore } from '@/stores/Items';
import { useUnitsStore } from '@/stores/Units';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

import Loader from '@/components/utils/Loader.vue';
import EditItem from '@/components/modals/items/EditItem.vue';
import DeleteItem from '@/components/modals/items/DeleteItem.vue';

const store = useItemsStore();
const unitsStore = useUnitsStore();
const { items, fetching } = storeToRefs(store);

const { mdAndDown } = useDisplay();
const editModal = ref(false);
const deleteModal = ref(false);

const modalsMap = {
    delete: deleteModal,
    edit: editModal
};

const openModal = (modal, item) => {
    store.setChosenItem(item);
    modalsMap[modal].value = true;
};

const closeModal = (modal) => {
    modalsMap[modal].value = false;
};

const route = useRoute();
const roomObjectId = route.params.roomId;

store.fetch(roomObjectId);
unitsStore.fetch();
</script>

<template>
    <v-container>
        <h1 class="d-flex align-center ga-3">
            <span class="text-subtitle-1">Stan zasobów w tym pokoju</span>
        </h1>
        <Loader :show-content="!fetching" type="circle">
            <v-container v-if="items.length > 0">
                <v-row>
                    <v-col cols="12" md="4" v-for="item in items" :key="item.objectId">
                        <v-card
                            @click="openModal('edit', item)"
                            class="item-card d-flex justify-space-between align-center pa-3"
                            :class="{
                                'desktop-only': !mdAndDown
                            }"
                            color="secondary"
                            variant="outlined"
                        >
                            <div class="d-flex align-center w-100">
                                <Icon
                                    class="door-icon"
                                    icon="mdi:cube-outline"
                                    :style="{ fontSize: '30px', color: '#00BD7E' }"
                                />
                                <span class="ml-1 text-body-1 font-weight-bold">
                                    {{ item.attributes.name }}
                                </span>
                            </div>

                            <v-btn @click.stop="openModal('delete', item)" variant="plain">
                                <Icon
                                    class="trash-icon"
                                    icon="ph:trash-bold"
                                    :style="{ fontSize: '20px', color: '#D72424' }"
                                />
                            </v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <p v-else>Brak zasobów w tym pokoju.</p>
        </Loader>
    </v-container>

    <EditItem
        v-model="editModal"
        @close="closeModal('edit')"
        :fields="['name', 'stock', 'maximumStock', 'unit', 'description']"
    />
    <DeleteItem v-model="deleteModal" @close="closeModal('delete')" />
</template>

<style scoped lang="scss">
.item-card.desktop-only {
    & .trash-icon {
        display: none;
    }

    &:hover {
        background-color: #00bd7e;

        & .trash-icon {
            display: block;
        }
    }
}
</style>
