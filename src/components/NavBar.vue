<script setup>
import logo from "@/assets/logo.png";

const headerLeftBtn = [
  {
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
  }
];
const headerRightBtn = [
  {
    text: "Login",
    path: "/login"
  }
];
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-secondary rounded mt-3">
    <div class="container-fluid">
      <div>
        <router-link to="/" class="navbar-brand logo">
          <img width="48" height="48" :src="logo" alt="logo">
        </router-link>
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarBtn"
              aria-controls="navbarBtn" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Header Buttons -->
      <div class="collapse navbar-collapse justify-content-between" id="navbarBtn">
        <!-- Left Button -->
        <ul class="navbar-nav column-gap-3">
          <li v-for="btn in headerLeftBtn" class="nav-item">
            <button class="btn btn-sm">
              <router-link :to="btn.path" class="nav-link" active-class="active">{{ btn.text }}</router-link>
            </button>
          </li>
        </ul>
        <!-- Right Button -->
        <ul class="navbar-nav column-gap-3">
          <li v-for="btn in headerRightBtn" class="nav-item">
            <button class="btn btn-sm">
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