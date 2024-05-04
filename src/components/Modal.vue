<script setup>
defineProps({
    title: {
        type: String,
        default: 'Dialog'
    }
});
</script>

<template>
    <v-dialog max-width="500" :scrollable="false">
        <template v-slot:default="{ isActive }">
            <v-card :title="title" color="third" border="primary lg">
                <v-card-text>
                    <slot name="modalContentSlot" :isActive="isActive" />
                </v-card-text>

                <v-card-actions>
                    <slot name="modalContentActions" :isActive="isActive" />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
