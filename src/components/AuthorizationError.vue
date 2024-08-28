<script setup>
const props = defineProps({
  errorMsg: String,
});
</script>

<template>
  <div v-if="props.errorMsg" class="alert alert-danger mt-2">{{ props.errorMsg }}</div>
</template>

<style scoped>

</style>