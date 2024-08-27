<script setup>
const props = defineProps({
  msg: String,
  link: String,
  actionMsg: String,
})
</script>

<template>
  <div
      class="container-fluid col-6 mt-3 bg-body-secondary border rounded p-2 gap-2 d-flex align-items-center justify-content-center">
    <p style="margin: 0">{{ props.msg }}</p>
    <router-link :to="props.link">
      <a class="icon-link icon-link-hover" style="cursor: pointer">{{ props.actionMsg }}</a>
    </router-link>
  </div>
</template>

<style scoped>

</style>