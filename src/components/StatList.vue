<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useHousesStore } from '@/stores/Houses';
import { useItemsStore } from '@/stores/Items';
import { useStatisticsStore } from '@/stores/Statistics';

import EditItem from '@/components/modals/items/EditItem.vue';

defineProps({
    statistics: { type: Array, default: () => [] }
});

const store = useItemsStore();
const statisticsStore = useStatisticsStore();
const housesStore = useHousesStore();

const { chosenHouse } = storeToRefs(housesStore);
const modal = ref(false);

const openModal = (item) => {
    store.setChosenItem(item);
    modal.value = true;
};

const closeModal = () => {
    modal.value = false;
};

const getColorFromStock = (stock, maximumStock) => {
    const percentage = (stock / maximumStock) * 100;
    const red = 215 - (percentage * (215 - 0)) / 100;
    const green = 45 + (percentage * (190 - 45)) / 100;
    const blue = 45;

    return `rgb(${red}, ${green}, ${blue})`;
};

const days = (givenDate) => {
    const givenDateTime = new Date(givenDate);

    const currentDate = new Date();

    const difference = currentDate.getTime() - givenDateTime.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return days;
};
</script>

<template>
    <v-card
        @click="openModal(item)"
        v-for="item in statistics"
        class="item-card mx-auto w-100"
        max-width="368"
        :key="item.id"
        :style="{
            color: getColorFromStock(item.attributes.stock, item.attributes.maximumStock),
            borderColor: getColorFromStock(item.attributes.stock, item.attributes.maximumStock)
        }"
    >
        <v-chip
            class="item-card-date bg-third"
            variant="elevated"
            :style="{
                borderColor: getColorFromStock(item.attributes.stock, item.attributes.maximumStock)
            }"
        >
            {{ days(item.attributes.updatedAt) }} dni temu
        </v-chip>
        <v-card-text class="item-card-text pa-4">
            <v-row align="center" justify="space-between">
                <v-col>
                    <span class="text-subtitle-1">{{ item.attributes.name }}</span>
                </v-col>

                <v-col cols="auto" class="text-h4">
                    {{ item.attributes.stock }} / {{ item.attributes.maximumStock }}
                </v-col>
            </v-row>
            <span v-if="item.attributes.unit" class="d-block text-caption">
                Jednostka: {{ item.attributes.unit.attributes.technical_label }}
            </span>
            <span v-if="item.attributes.description" class="d-block text-caption">
                Opis: {{ item.attributes.description }}
            </span>
        </v-card-text>
    </v-card>

    <EditItem
        v-model="modal"
        @updated="statisticsStore.fetchStatistics(chosenHouse.id)"
        @close="closeModal"
        :fields="['stock']"
    />
</template>

<style scoped lang="scss">
.item-card {
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;
    overflow: visible;

    &-text {
        background-color: #181818;
    }

    &-date {
        position: absolute;
        transform: translateY(-50%);
        left: -2px;
        border-width: 2px;
        border-style: solid;
    }
}
</style>
