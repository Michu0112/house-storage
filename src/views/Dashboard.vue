<script setup>
import { useHousesStore } from '@/stores/Houses';
import { useStatisticsStore } from '@/stores/Statistics';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { watch } from 'vue';
import debounce from 'lodash.debounce';

import Loader from '@/components/utils/Loader.vue';
import StatList from '@/components/StatList.vue';

const store = useStatisticsStore();
const housesStore = useHousesStore();
const { statistics, fetching, search } = storeToRefs(store);
const { chosenHouse } = storeToRefs(housesStore);
const savedHouseId = localStorage.getItem('chosenHouseId');

const fetchFromLocal = async () => {
    if (savedHouseId) {
        await housesStore.fetchAll();
        housesStore.chooseHouse(savedHouseId, false);
    }
};

const onSearch = debounce((chosenHouseId) => store.fetchStatistics(chosenHouseId), 500);

watch(chosenHouse, (v) => {
    store.fetchStatistics(v.id);
});

fetchFromLocal();
</script>

<template>
    <template v-if="chosenHouse.id">
        <h2>Aktualny stan: {{ chosenHouse.attributes.name }}</h2>

        <v-text-field
            @input="onSearch(chosenHouse.id)"
            label="Wyszukaj zasób"
            type="text"
            variant="outlined"
            v-model="search"
            class="mt-2"
        />

        <main class="d-flex flex-column mt-10">
            <Loader :show-content="!fetching" type="circle">
                <div
                    v-if="statistics && statistics.length"
                    class="d-flex flex-column flex-md-row ga-5"
                >
                    <StatList :statistics="statistics" />
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
