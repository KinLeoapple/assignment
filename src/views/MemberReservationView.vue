<script setup>
import {computed, ref} from "vue";
import starFill from "@/assets/img/star-fill.svg";
import star from "@/assets/img/star.svg";

const memberReservationBtn = ["Make Reservation", "My Reservation"];

const psychotherapists = computed(() => {
  return JSON.parse(localStorage.getItem("accounts") || "[]").filter(account => account.role === "2");
});
const list = ref(psychotherapists.value);

const reservationIndex = ref(0);
const changeBtnIndex = (index) => {
  reservationIndex.value = index;
}

const searchKeyword = ref({
  keyword: "",
});

const search = () => {
  list.value = psychotherapists.value.filter((account) => account.username.includes(searchKeyword.value.keyword));
}

const computeRating = (username) => {
  // compute the rating from each reservation
}
</script>

<template>
  <!-- The Nav -->
  <nav class="navbar navbar-expand-lg bg-body-secondary rounded mt-3 mb-3">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#memberReservationNavBtn"
              aria-controls="navbarBtn" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="memberReservationNavBtn">
        <ul class="navbar-nav column-gap-3">
          <li v-for="(btn, index) in memberReservationBtn" class="nav-item">
            <button class="btn btn-sm" @click="changeBtnIndex(index)">
              <span class="nav-link" :class="{'active text-primary': reservationIndex === index}">{{ btn }}</span>
            </button>
          </li>
        </ul>
        <!-- The Search Bar -->
        <form class="d-flex" role="search" @submit.prevent="search">
          <input class="form-control me-2" type="search" placeholder="Search" v-model="searchKeyword.keyword">
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <!-- List -->
  <div class="container-fluid border rounded p-2 d-flex flex-column">
    <h1 class="font-monospace">Psychotherapists</h1>
    <div class="container d-flex flex-column">
      <div v-for="account in list" class="row justify-content-between overflow-hidden bg-body-secondary rounded mb-3 p-2">
        <div class="col">
          <div class="card-body">
            <h5 class="mt-2 text-truncate font-monospace">{{ account.username }}</h5>
            <!-- Display The Rating -->
            <div>
              <div>
                <img :src="starFill" alt=""/>
              </div>
            </div>
            <div class="row justify-content-end">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
                <button class="btn btn-primary">Make a Reservation</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>