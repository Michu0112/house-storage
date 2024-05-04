<script setup>
import { useHousesStore } from '@/stores/Houses';
import { useStatisticsStore } from '@/stores/Statistics';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { watch } from 'vue';

import Loader from '@/components/utils/Loader.vue';

const store = useStatisticsStore();
const housesStore = useHousesStore();
const { statistics, fetching } = storeToRefs(store);
const { chosenHouse } = storeToRefs(housesStore);
const savedHouseId = localStorage.getItem('chosenHouseId');

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

const fetchFromLocal = async () => {
    if (savedHouseId) {
        await housesStore.fetchAll();
        housesStore.chooseHouse(savedHouseId, false);
        store.fetchStatistics(savedHouseId);
    }
};

watch(chosenHouse, (v) => {
    store.fetchStatistics(v.id);
});

fetchFromLocal();
</script>

<template>
    <template v-if="chosenHouse.id">
        <h2>Aktualny stan: {{ chosenHouse.attributes.name }}</h2>
        <main class="d-flex flex-column mt-10">
            <Loader :show-content="!fetching">
                <div
                    v-if="statistics && statistics.length"
                    class="d-flex flex-column flex-md-row ga-5"
                >
                    <v-card
                        v-for="item in statistics"
                        class="item-card mx-auto w-100"
                        max-width="368"
                        :key="item.id"
                        :style="{
                            color: getColorFromStock(
                                item.attributes.stock,
                                item.attributes.maximumStock
                            ),
                            borderColor: getColorFromStock(
                                item.attributes.stock,
                                item.attributes.maximumStock
                            )
                        }"
                    >
                        <v-chip
                            class="item-card-date bg-third"
                            variant="elevated"
                            :style="{
                                borderColor: getColorFromStock(
                                    item.attributes.stock,
                                    item.attributes.maximumStock
                                )
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
                            <span v-if="item.attributes.description" class="text-caption">
                                Opis: {{ item.attributes.description }}
                            </span>
                        </v-card-text>
                    </v-card>
                </div>

                <p v-else>Brak danych.</p>
            </Loader>
        </main>
    </template>
    <template v-else>
        <h3 class="text-grey-darken-1 mt-10 text-center">
            Wybierz dom, którego stan chcesz przejrzeć. Uzyj przycisku
            <Icon
                icon="mdi:house-find-outline"
                color="primary"
                :style="{ fontSize: '30px', color: '#00BD7E' }"
            />
        </h3>
    </template>
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
