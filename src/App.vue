<script setup>
import { Icon } from '@iconify/vue';
import { RouterView } from 'vue-router';
import router from '@/router';
import PickHouse from '@/components/PickHouse.vue';

const goTo = (name) => {
    router.push({ name });
};
</script>

<template>
    <v-app class="pa-5" :full-height="false">
        <v-main>
            <RouterView />
        </v-main>

        <v-bottom-navigation>
            <v-btn @click="goTo('dashboard')" value="storage">
                <Icon
                    icon="vaadin:storage"
                    class="mb-1"
                    :style="{ fontSize: '30px', color: '#00BD7E' }"
                />
                <span>Zasoby</span>
            </v-btn>

            <v-btn @click="goTo('houses')" value="edit">
                <Icon
                    icon="mdi:pen-plus"
                    class="mb-1"
                    :style="{ fontSize: '30px', color: '#00BD7E' }"
                />
                <span>Edytuj</span>
            </v-btn>
        </v-bottom-navigation>

        <PickHouse />
    </v-app>
</template>
