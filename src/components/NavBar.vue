<script setup>
import logo from "@/assets/logo.png";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const headerLeftBtn = [
  {
    text: "Home",
    path: "/"
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

const isLogin = ref(false);

const accounts = computed(() => {
  return JSON.parse(localStorage.getItem("accounts") || "[]");
});

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"username": "", "password": ""}');
});

const tryLogin = () => {
  const account = accounts.value.find((account) => account.username === currentAccount.value.username);
  if (account) {
    isLogin.value = account.password === currentAccount.value.password;
  } else {
    isLogin.value = false;
  }
}

const logout = () => {
  localStorage.removeItem("currentAccount");
  isLogin.value = false;
  router.push("/");
}

onMounted(() => {
  tryLogin();
});
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
              <router-link :to="btn.path" class="nav-link" active-class="active text-primary">{{ btn.text }}</router-link>
            </button>
          </li>
        </ul>
        <!-- Right Button -->
        <ul class="navbar-nav column-gap-3">
          <!-- If Not Login -->
          <li v-if="!isLogin" v-for="btn in headerRightBtn" class="nav-item">
            <button class="btn btn-sm">
              <router-link :to="btn.path" class="nav-link" active-class="active text-primary">{{ btn.text }}</router-link>
            </button>
          </li>
          <!-- If Login -->
          <li v-else class="nav-item dropdown">
            <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Account: {{ currentAccount.username }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/profile" class="dropdown-item" style="cursor: pointer">Profile</router-link>
              </li>
              <li @click="logout">
                <a class="dropdown-item" style="cursor: pointer">Logout</a>
              </li>
            </ul>
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