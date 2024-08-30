<script setup>
import HomeBanner from "@/components/HomeBanner.vue";
import HomeBlogList from "@/components/HomeBlogList.vue";
import {checkStr} from "@/assets/js/checkStr.js";

document.head.getElementsByTagName("title")[0].innerText = checkStr("Home");
</script>

<template>
  <HomeBanner/>
  <HomeBlogList/>
</template>

<style scoped>

</style>