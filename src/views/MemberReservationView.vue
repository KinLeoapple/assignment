<script setup>
import {computed, nextTick, ref} from "vue";
import StarSvg from "@/components/StarSvg.vue";
import StarFillSvg from "@/components/StarFillSvg.vue";
import ReservationError from "@/components/ReservationError.vue";
import RatingStar from "@/components/RatingStar.vue";
import CheckSvg from "@/components/CheckSvg.vue";
import WarningSvg from "@/components/WarningSvg.vue";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";
import axios from "axios";

const memberReservationBtn = ["Make Reservation", "My Reservation"];

const findReservations = async () => {
  try {
    const q = query(collection(db, "reservations"));
    const psychotherapists = await getDocs(q);
    let list = [];
    psychotherapists.forEach(p => {
      list.push(p.data());
    });
    return list;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const findPsychotherapists = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "2"));
    const psychotherapists = await getDocs(q);
    let list = [];
    psychotherapists.forEach(p => {
      list.push({
        username: p.data().username,
        role: p.data().role,
        email: p.data().email,
      })
    });
    console.log(list);
    return list;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const list = ref();

const reservationIndex = ref(0);
const changeBtnIndex = async (index) => {
  reservationIndex.value = index;
  if (index === 0) {
    list.value = await findPsychotherapists();
  } else {
    list.value = await findReservations();
  }
}

const searchKeyword = ref({
  keyword: "",
});

const search = async () => {
  if (reservationIndex.value === 0) {
    list.value = await findPsychotherapists().filter((account) => account.username.includes(searchKeyword.value.keyword));
  } else {
    list.value = await findReservations().filter((reservation) => reservation.psychotherapist.includes(searchKeyword.value.keyword));
  }
}

const setReservationPsychotherapists = (username) => {
  reservationData.value.psychotherapist = username
}

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"username": ""}');
});

const reservationData = ref({
  date: "",
  time: "",
  member: currentAccount.value.username,
  psychotherapist: ""
});

const reservationErrors = ref({
  date: null,
  time: null,
});

const validateDate = () => {
  if (new Date(reservationData.value.date + "T" + new Date().toTimeString()) - new Date() < 0) {
    reservationErrors.value.date = "Date is not available";
  } else {
    reservationErrors.value.date = null;
  }
}

const validateTime = async (username) => {
  const list = await findReservations().filter((reservation) => reservation.psychotherapist === username);
  const bookings = list.filter((reservation) => reservation.date === reservationData.value.date && reservation.time === reservationData.value.time) || [];
  const date = new Date().toDateString();
  if (new Date(date + "T" + reservationData.value.time) - new Date() < 60 * 6 * 1000) { // Less than one hour
    reservationErrors.value.time = "Time is not available";
  } else if (bookings.length > 0) {
    reservationErrors.value.time = "Time is not available";
  } else {
    reservationErrors.value.time = null;
  }
}

const modalClose = ref();
const makeReservation = () => {
  validateDate(reservationData.value.psychotherapist);
  validateTime(reservationData.value.psychotherapist);

  if (!reservationErrors.value.date && !reservationErrors.value.time) {
    try {
      storeReservation().then(r => {
        if (r) {
          clearForm();
          nextTick(() => {
            modalClose.value.click();
          });
          location.reload();
        }
      });
    } catch (_) {

    }
  }
}

const storeReservation = () => {
  return new Promise(resolve => {
    addDoc(collection(db, "reservations"), {
      date: reservationData.value.date,
      time: reservationData.value.time,
      member: currentAccount.value.username,
      psychotherapist: reservationData.value.psychotherapist
    }).then(() => {
      resolve(true);
    });
  })
}

const clearForm = () => {
  reservationData.value.date = "";
  reservationData.value.time = "";
  reservationData.value.member = "";
  reservationData.value.psychotherapist = "";
}

const computeRating = async (username) => {
  // compute the rating from each reservation
  const list = await findReservations().filter((reservation) => reservation.psychotherapist === username);
  let total = 0;
  for (const reservation of list) {
    total += reservation.rate || 0; // the number would be zero if the rate does not exist
  }
  const rating = Math.floor(total / list.length);
  if (!isNaN(rating)) {
    return new Array(5).fill(0, 0, rating);
  } else {
    return new Array(5);
  }
}

const reservationCount = ref(0);
// cloud function
const getReservationCount = async () => {
  try {
    const response = await axios.get("https://countbooks-q2pvqpvzbq-uc.a.run.app?member=" + currentAccount.value.username);
    reservationCount.value = response.data.count;
  } catch (error) {
    console.error("Error fetching book count:", error);
    reservationCount.value = 0;
  }
}

const checkOnline = async (name) => {
  const q = query(collection(db, "session"), where("username", "==", name));
  const sessions = await getDocs(q);
  let isOnline = false;
  sessions.forEach((session) => {
    if (session.data().username === currentAccount.value.username) {
      let now = new Date().getTime();
      let pass = Number(session.data().heartbeat);
      isOnline = (now - pass) <= 5 * 60 * 1000; // offline if more than 5 min
    }
  });
  return isOnline;
}

nextTick(async () => {
  await changeBtnIndex();
  await getReservationCount();
})

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

  <!-- Psychotherapists List or My Reservations List -->
  <div class="container-fluid border rounded p-2 d-flex flex-column">
    <h1 v-if="reservationIndex === 0" class="font-monospace">Psychotherapists</h1>
    <h1 v-else class="font-monospace">My Reservations | <span>Total: {{ reservationCount }}</span></h1>
    <div class="container d-flex flex-column">
      <div v-for="item in list"
           class="row justify-content-between overflow-hidden bg-body-secondary rounded mb-3 p-2">
        <div class="col">
          <div class="card-body">
            <h5 v-if="reservationIndex === 0" class="mt-2 text-truncate font-monospace">{{ item.username }}</h5>
            <h5 v-else class="mt-2 text-truncate font-monospace">{{ item.psychotherapist }}</h5>
            <!-- Display Date Time -->
            <p v-if="reservationIndex === 1">{{ new Date(item.date + "T" + item.time).toLocaleString() }}</p>
            <!-- Display The Rating -->
            <div v-if="reservationIndex === 0" class="d-flex gap-1">
              <div v-for="key in computeRating(item.username)">
                <StarFillSvg v-if="key === 0" style="fill: darkorange"/>
                <StarSvg v-else style="fill: darkorange"/>
              </div>
            </div>
            <!-- Rate The Reservation -->
            <div v-else class="d-flex gap-1">
              <RatingStar :reservation="item"/>
              <CheckSvg style="fill: green" v-if="item.rate !== undefined"/>
              <WarningSvg style="fill: orangered" v-else/>
            </div>
            <div class="row justify-content-end">
              <div v-if="reservationIndex === 0" class="d-grid gap-2 d-md-flex justify-content-md-end"
                   style="padding: 0">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reservationModal"
                        @click="setReservationPsychotherapists(item.username)">Make a Reservation
                </button>
              </div>
              <div v-else class="d-grid gap-2 d-md-flex justify-content-md-end">
                <CheckSvg style="fill: green" v-if="new Date() > new Date(item.date + 'T' + item.time)"/>
                <WarningSvg style="fill: orangered" v-else/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Reservation Modal -->
  <div v-if="reservationIndex === 0" class="modal fade" tabindex="-1" id="reservationModal" data-bs-backdrop="static"
       data-bs-keyboard="false"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Make a Reservation with {{ reservationData.psychotherapist }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  ref="modalClose"
                  @click="setReservationPsychotherapists('')"></button>
        </div>
        <div class="modal-body">
          <div class="col">
            <label for="datePicker" class="form-label">Pick a Date</label>
            <input type="date" class="form-control" id="datePicker" v-model="reservationData.date">
            <ReservationError :error-msg="reservationErrors.date"/>
          </div>
          <div class="col">
            <label for="timePicker" class="form-label">Pick a Time</label>
            <input type="time" class="form-control" id="timePicker" v-model="reservationData.time">
            <ReservationError :error-msg="reservationErrors.time"/>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                  @click="setReservationPsychotherapists('')">Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="makeReservation">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>