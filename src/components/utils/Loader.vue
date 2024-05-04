<script setup>
import { computed } from 'vue';

const props = defineProps({
    showContent: {
        default: true,
        type: Boolean
    },
    type: {
        default: 'linear',
        type: String
    },
    color: {
        default: 'primary',
        type: String
    },
    variant: {
        default: 'replace',
        type: String
    }
});

const typeMap = {
    linear: 'v-progress-linear',
    circle: 'v-progress-circular'
};

const component = computed(() => {
    return typeMap[props.type];
});

const isReplaceVariant = computed(() => {
    return props.variant === 'replace';
});

const isOverlayVariant = computed(() => {
    return props.variant === 'overlay';
});
</script>

<template>
    <template v-if="!showContent && isReplaceVariant">
        <v-row>
            <v-col class="d-flex justify-center align-center">
                <component :is="component" :color="color" indeterminate />
            </v-col>
        </v-row>
    </template>
    <template v-else-if="!showContent && isOverlayVariant">
        <div
            class="loader-overlay position-absolute w-100 h-100 d-flex justify-center align-center"
        >
            <component :is="component" :color="color" indeterminate />
        </div>
        <slot />
    </template>
    <slot v-else />
</template>
