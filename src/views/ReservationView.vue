<script setup>
import MemberReservationView from "@/views/MemberReservationView.vue";
import PsychotherapistReservationView from "@/views/PsychotherapistReservationView.vue";
import {computed, onMounted, ref} from "vue";

const isMember = ref(false);

const accounts = computed(() => {
  return JSON.parse(localStorage.getItem("accounts") || "[]");
});

const currentAccount = computed(() => {
  return JSON.parse(localStorage.getItem("currentAccount") || '{"name": "", "password": ""}');
});

const checkMember = () => {
  const account = accounts.value.find((account) => account.username === currentAccount.value.username);
  if (account) {
    isMember.value = account.role === 1;
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