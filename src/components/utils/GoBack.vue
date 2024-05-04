<script setup>
import router from '@/router';
</script>

<template>
    <div @click="router.back()" class="c-pointer d-flex align-center">
        <slot />
    </div>
</template>

<style scoped>
.c-pointer {
    cursor: pointer;
}
</style>
