<script setup>
import StarFillSvg from "@/components/StarFillSvg.vue";
import StarSvg from "@/components/StarSvg.vue";
import {computed, ref} from "vue";

const props = defineProps({
  reservation: Object
});

const canBeRate = ref(new Date() > new Date(props.reservation.date + 'T' + props.reservation.time));
const hasRating = ref(props.reservation.rate !== undefined);
const isHover = ref(new Array(5));

const reservations = computed(() => {
  return JSON.parse(localStorage.getItem("reservations") || '[]');
});

if (hasRating.value) {
  isHover.value.fill(true, 0, props.reservation.rate);
  isHover.value.fill(false, props.reservation.rate, 5 - props.reservation.rate);
} else {
  isHover.value.fill(false);
}

const mouseEnter = (index) => {
  if (canBeRate.value && !hasRating.value) {
    for (let i = 0; i < isHover.value.length; i++) {
      isHover.value[i] = i <= index;
    }
  }
}

const mouseLeave = () => {
  if (canBeRate.value && !hasRating.value) {
    for (let i = 0; i < isHover.value.length; i++) {
      isHover.value[i] = false;
    }
  }
}

const rating = (index) => {
  if (canBeRate.value && !hasRating.value) {
    const findIndex = reservations.value.findIndex(reservation =>
        reservation.psychotherapist === props.reservation.psychotherapist
        && reservation.member === props.reservation.member
        && reservation.date === props.reservation.date
        && reservation.time === props.reservation.time);
    props.reservation.rate = index + 1;
    reservations.value[findIndex] = props.reservation;
    localStorage.setItem("reservations", JSON.stringify(reservations.value));
    hasRating.value = true;
  }
}
</script>

<template>
  <div v-for="(hovering, index) in isHover" @mouseleave="mouseLeave">
    <div @mouseenter="mouseEnter(index)" @click="rating(index)"
         :style="[{'cursor': (hasRating || !canBeRate) ? 'default' : 'pointer'}]">
      <StarSvg v-show="!hovering" style="fill: darkorange"/>
      <StarFillSvg v-show="hovering" style="fill: darkorange"/>
    </div>
  </div>
</template>

<style scoped>

</style>