<script setup>
import { useOptionsStore } from '@/stores/Options';
import { storeToRefs } from 'pinia';
import { useHousesStore } from '@/stores/Houses';
import { Icon } from '@iconify/vue';

const props = defineProps({
    dataSource: {
        type: String,
        default: ''
    },
    fetchFnName: {
        type: String,
        default: ''
    }
});

const housesStore = useHousesStore();
const optionsStore = useOptionsStore();

const { chosenHouse } = storeToRefs(housesStore);
const optionsState = storeToRefs(optionsStore);

const source = optionsState[props.dataSource];

optionsStore[props.fetchFnName](chosenHouse.value?.id);
</script>

<template>
    <v-autocomplete :items="source.options">
        <template #clear="{ props }">
            <Icon
                v-bind="props"
                icon="ic:baseline-clear"
                color="primary"
                class="mr-1"
                :style="{ fontSize: '30px', color: '#00BD7E' }"
            />
        </template>
    </v-autocomplete>
</template>
