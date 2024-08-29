<script setup>
import {computed, ref} from "vue";
import RatingStar from "@/components/RatingStar.vue";
import WarningSvg from "@/components/WarningSvg.vue";
import CheckSvg from "@/components/CheckSvg.vue";

const psychotherapistReservationBtn = ["Reservations"];

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"username": "", "password": ""}');
});

// find all related reservations
const reservations = computed(() => {
  return JSON.parse(localStorage.getItem("reservations") || '[]')
      .filter(reservation => reservation.psychotherapist === currentAccount.value.username);
});

const list = ref(reservations.value);

const reservationIndex = ref(0);
const changeBtnIndex = (index) => {
  reservationIndex.value = index;
}

const searchKeyword = ref({
  keyword: "",
});

const search = () => {
  list.value = reservations.value.filter((reservation) => reservation.member.includes(searchKeyword.value.keyword));
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
          <li v-for="(btn, index) in psychotherapistReservationBtn" class="nav-item">
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

  <!-- Reservations List -->
  <div class="container-fluid border rounded p-2 d-flex flex-column">
    <h1 class="font-monospace">Reservations</h1>
    <div class="container d-flex flex-column">
      <div v-for="reservation in list"
           class="row justify-content-between overflow-hidden bg-body-secondary rounded mb-3 p-2">
        <div class="col">
          <div class="card-body">
            <h5 class="mt-2 text-truncate font-monospace">{{ reservation.member }}</h5>
            <!-- Display Date Time -->
            <p>{{ new Date(reservation.date + "T" + reservation.time).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>