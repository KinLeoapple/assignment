<script setup>
import {computed} from "vue";

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"username": "", "password": ""}');
});
</script>

<template>

</template>

<style scoped>

</style>