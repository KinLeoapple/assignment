<script setup>
import MemberReservationView from "@/views/MemberReservationView.vue";
import PsychotherapistReservationView from "@/views/PsychotherapistReservationView.vue";
import {computed, onMounted, ref} from "vue";
import {checkStr} from "@/assets/js/checkStr.js";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";

document.head.getElementsByTagName("title")[0].innerText = checkStr("Reservation");

const isMember = ref(false);

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"username": ""}');
});

const checkMember = async () => {
  try {
    const q = query(collection(db, "users"), where("username", "==", currentAccount.value.username));
    const account = await getDocs(q);
    account.forEach(p => {
      if (p.data().username === currentAccount.value.username) {
        isMember.value = p.data().role === "1";
      }
    });
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  checkMember();
});
</script>

<template>
  <!-- If is a member -->
  <MemberReservationView v-if="isMember"/>
  <!-- If is a psychotherapist -->
  <PsychotherapistReservationView v-else/>
</template>

<style scoped>

</style>