<script setup>
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <div class="container p-3">
    <!-- Page Header -->
    <header>
      <NavBar/>
    </header>

    <!-- Page Content -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>

</style>
