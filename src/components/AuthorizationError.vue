<script setup>
const props = defineProps({
  errorMsg: String,
});
</script>

<template>
  <div v-if="props.errorMsg" class="text-danger">{{ props.errorMsg }}</div>
</template>

<style scoped>

</style>