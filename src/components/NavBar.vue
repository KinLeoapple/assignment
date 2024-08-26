<script setup>
import {ref} from "vue";
import { useRouter } from "vue-router";
import logo from "@/assets/logo.png";

const headerLeftBtn = [{
  text: "Home",
  path: "/"
},
  {
    text: "Reading",
    path: "/reading"
  },
  {
    text: "Community",
    path: "/community"
  },
  {
    text: "Reservation",
    path: "/reservation"
  }];
const headerRightBtn = [{
  text: "Login",
  path: "/login"
}];

const router = useRouter();

const collapse = ref(false);
const currentPageIndex = ref(0);
const changePage = (pageIndex) => {
  currentPageIndex.value = pageIndex;
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-secondary rounded mt-3">
    <div class="container-fluid">
      <div @click="changePage(0)">
        <router-link to="/" class="navbar-brand logo">
          <img width="48" height="48" :src="logo" alt="logo">
        </router-link>
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarBtn"
              aria-controls="navbarBtn" :aria-expanded="collapse" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Header Buttons -->
      <div class="collapse navbar-collapse justify-content-between" id="navbarBtn">
        <!-- Left Button -->
        <ul class="navbar-nav column-gap-3">
          <li v-for="(btn, index) in headerLeftBtn" class="nav-item">
            <button class="btn btn-sm" @click="changePage(index)">
              <router-link :to="btn.path" class="nav-link" active-class="active">{{ btn.text }}</router-link>
            </button>
          </li>
        </ul>
        <!-- Right Button -->
        <ul class="navbar-nav column-gap-3">
          <li v-for="(btn, index) in headerRightBtn" class="nav-item">
            <button class="btn btn-sm" @click="changePage(headerLeftBtn.length + index)">
              <router-link :to="btn.path" class="nav-link" active-class="active">{{ btn.text }}</router-link>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.logo {
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}
</style>