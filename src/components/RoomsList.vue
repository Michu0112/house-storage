<script setup>
import { Icon } from '@iconify/vue';
import { useRoomsStore } from '@/stores/Rooms';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import Loader from '@/components/utils/Loader.vue';
import DeleteRoom from '@/components/modals/rooms/DeleteRoom.vue';
import EditRoom from '@/components/modals/rooms/EditRoom.vue';

const route = useRoute();
const store = useRoomsStore();
const { rooms, fetching } = storeToRefs(store);

const houseObjectId = route.params.houseId;
const { mdAndDown } = useDisplay();
const editModal = ref(false);
const deleteModal = ref(false);

const modalsMap = {
    delete: deleteModal,
    edit: editModal
};

const openModal = (modal, room) => {
    store.setChosenRoom(room);
    modalsMap[modal].value = true;
};

const closeModal = (modal) => {
    modalsMap[modal].value = false;
};

store.fetch(houseObjectId);
</script>

<template>
    <v-container>
        <h1 class="d-flex align-center justify-center ga-3">
            <span>Pokoje w tym domu</span>
        </h1>
        <Loader :show-content="!fetching" type="circle">
            <v-container v-if="rooms.length > 0">
                <v-row>
                    <v-col cols="12" md="4" v-for="room in rooms" :key="room.id">
                        <v-card
                            @click="store.chooseRoom(room.id)"
                            class="room-card d-flex justify-space-between align-center pa-3"
                            :class="{
                                'desktop-only': !mdAndDown
                            }"
                            color="secondary"
                            variant="outlined"
                        >
                            <div class="d-flex align-center w-100">
                                <Icon
                                    class="door-icon"
                                    icon="fluent:door-20-regular"
                                    :style="{ fontSize: '30px', color: '#00BD7E' }"
                                />
                                <span class="text-body-1 font-weight-bold">
                                    {{ room.attributes.name }}
                                </span>
                            </div>

                            <v-btn
                                @click.stop="openModal('edit', room)"
                                variant="plain"
                                size="x-small"
                            >
                                <Icon
                                    class="trash-icon"
                                    icon="clarity:edit-solid"
                                    :style="{ fontSize: '20px', color: '#ebebeba3' }"
                                />
                            </v-btn>

                            <v-btn @click.stop="openModal('delete', room)" variant="plain">
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
            <p v-else>Brak pokoi w tym domu.</p>
        </Loader>
    </v-container>

    <DeleteRoom v-model="deleteModal" @close="closeModal('delete')" />
    <EditRoom v-model="editModal" @close="closeModal('edit')" />
</template>

<style scoped lang="scss">
.room-card.desktop-only {
    & .trash-icon {
        transition: 0.5s;
        display: none !important;
    }

    &:hover {
        background-color: #00bd7e;
        & .door-icon {
            color: #ebebeba3 !important;
        }

        & .trash-icon {
            display: block !important;
            color: #d72424;
        }
    }
}
</style>
