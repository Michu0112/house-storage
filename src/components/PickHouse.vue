<script setup>
import { useHousesStore } from '@/stores/Houses';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import ChooseHouse from '@/components/modals/houses/ChooseHouse.vue';

const housesStore = useHousesStore();
const { chosenHouse } = storeToRefs(housesStore);
const modal = ref(false);

const openModal = () => {
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
};
</script>

<template>
    <v-badge class="floating-badge" :class="{ picked: chosenHouse.id }" color="success" dot>
        <v-btn @click="openModal" icon="" class="floating">
            <Icon
                icon="mdi:house-find-outline"
                color="primary"
                :style="{ fontSize: '30px', color: '#00BD7E' }"
            />
        </v-btn>
    </v-badge>

    <ChooseHouse v-model="modal" @close="closeModal()" />
</template>

<style lang="scss">
.floating {
    position: fixed;
    bottom: 76px;
    right: 20px;

    &-badge.picked {
        position: fixed;
        bottom: 120px;
        right: 60px;
    }
}
</style>
