<script setup>
import { useHousesStore } from '@/stores/Houses';
import { useStatisticsStore } from '@/stores/Statistics';
import { storeToRefs } from 'pinia';

import Loader from '@/components/utils/Loader.vue';

const store = useStatisticsStore();
const housesStore = useHousesStore();
const { statistics, fetching } = storeToRefs(store);
const { chosenHouse } = storeToRefs(housesStore);

const getColorFromStock = (stock, maximumStock) => {
    const percentage = (stock / maximumStock) * 100;
    const red = 215 - (percentage * (215 - 0)) / 100;
    const green = 45 + (percentage * (190 - 45)) / 100;
    const blue = 45;

    return {
        borderColor: `rgb(${red}, ${green}, ${blue})`,
        color: `rgb(${red}, ${green}, ${blue})`
    };
};

store.fetchStatistics('XqGimY1eeL');
</script>

<template>
    <template v-if="chosenHouse.id">
        <h1>Aktualny stan</h1>
        <main class="d-flex flex-column mt-10">
            <Loader :show-content="!fetching">
                <div
                    v-if="statistics && statistics.length"
                    class="d-flex flex-column flex-md-row ga-3"
                >
                    <v-card
                        v-for="item in statistics"
                        class="item-card mx-auto w-100"
                        max-width="368"
                        :key="item.id"
                        :style="
                            getColorFromStock(item.attributes.stock, item.attributes.maximumStock)
                        "
                    >
                        <v-card-text class="item-card-text pa-4">
                            <v-row align="center" justify="space-between">
                                <v-col>
                                    <span class="text-subtitle-1">{{ item.attributes.name }}</span>
                                </v-col>

                                <v-col cols="auto" class="text-h4">
                                    {{ item.attributes.stock }} / {{ item.attributes.maximumStock }}
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>

                <p v-else>Brak danych.</p>
            </Loader>
        </main>
    </template>
    <template v-else>
        <h3 class="text-grey-darken-1 mt-10 text-center">
            Wybierz dom, którego stan chcesz przejrzeć. Uzyj przycisku na dole.
        </h3>
    </template>
</template>

<style scoped lang="scss">
.item-card {
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;

    &-text {
        background-color: #181818;
    }
}
</style>
