<script setup lang="ts">
defineProps({
    error: {
        type: String
    }
});
</script>

<template>
    <div class="error">
        <div class="text-danger">
            {{ error }}
        </div>
    </div>
</template>
