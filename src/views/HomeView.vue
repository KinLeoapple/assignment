<script setup>
import HomeBanner from "@/components/HomeBanner.vue";
import HomeBlogList from "@/components/HomeBlogList.vue";

document.head.getElementsByTagName("title")[0].innerText = "Home";
</script>

<template>
  <HomeBanner/>
  <HomeBlogList/>
</template>

<style scoped>

</style>