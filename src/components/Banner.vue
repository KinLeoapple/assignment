<script setup>
import banner1 from "@/assets/img/banner-1.jpg";
import banner2 from "@/assets/img/banner-2.jpg";
import banner3 from "@/assets/img/banner-3.jpg";
import {ref} from "vue";

const bannerList = [banner1, banner2, banner3];
const bannerWaitTime = 5 * 1000;

const bannerIndex = ref(1);

let timer = setInterval(() => {
  if (bannerIndex.value < 3)
    bannerIndex.value += 1;
  else
    bannerIndex.value = 1;
}, bannerWaitTime);

const setBannerIndex = (index) => {
  clearInterval(timer);
  bannerIndex.value = index;
  timer = setInterval(() => {
    if (bannerIndex.value < 3)
      bannerIndex.value += 1;
    else
      bannerIndex.value = 1;
  }, bannerWaitTime);
}
</script>

<template>
  <div class="row justify-content-between mt-3">
    <!-- Left Side -->
    <div class="col-9">
      <div class="ratio ratio-21x9">
        <img class="rounded" v-for="(banner, index) in bannerList" v-show="bannerIndex === index + 1" :src="banner" alt=""/>
      </div>
    </div>
    <!-- Right Side -->
    <div class="col-3 d-flex flex-column justify-content-between">
      <div v-for="(banner, index) in bannerList"
           class="ratio ratio-21x9 banner-small"
           @click="setBannerIndex(index + 1)">
        <img class="rounded" :class="{'border border-3 border-primary-subtle': bannerIndex === index + 1}" :src="banner" alt=""/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-small {
  cursor: pointer;
}
</style>