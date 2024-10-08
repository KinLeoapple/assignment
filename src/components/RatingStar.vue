<script setup>
import StarFillSvg from "@/components/StarFillSvg.vue";
import StarSvg from "@/components/StarSvg.vue";
import {ref} from "vue";
import {collection, getDocs, query, updateDoc, doc} from "firebase/firestore";
import db from "@/firebase/db.js";


const props = defineProps({
  reservation: Object
});

const canBeRate = ref(new Date() > new Date(props.reservation.date + 'T' + props.reservation.time));
const hasRating = ref(props.reservation.rate !== undefined);
const isHover = ref(new Array(5));

const findReservation = async () => {
  try {
    const q = query(collection(db, "reservations"));
    const reservations = await getDocs(q);
    reservations.forEach(p => {
      if (p.data().psychotherapist === props.reservation.psychotherapist
          && p.data().member === props.reservation.member
          && p.data().date === props.reservation.date
          && p.data().time === props.reservation.time) {
        return p.data()
      }
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

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

const rating = async (index) => {
  if (canBeRate.value && !hasRating.value) {
    const reservation = await findReservation();
    if (reservation != null) {
      await updateDoc(doc(db, "reservations", reservation.id), {
        date: props.reservation.date,
        time: props.reservation.time,
        member: props.reservation.member,
        psychotherapist: props.reservation.psychotherapist,
        rate: index + 1
      });
      hasRating.value = true;
    }
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