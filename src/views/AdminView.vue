<script setup>
import * as echarts from 'echarts/core';
import {TooltipComponent, LegendComponent} from 'echarts/components';
import {PieChart} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {nextTick, onMounted, ref} from "vue";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";

const isLogin = ref(false);

const formData = ref({
  username: "",
  password: ""
});

const submitForm = async () => {
  try {
    const q = query(collection(db, "admin"), where("username", "==", formData.value.username));
    const admin = await getDocs(q);
    admin.forEach(a => {
      if (a.data().username === formData.value.username && a.data().password === formData.value.password) {
        isLogin.value = true;
      }
    })
  } catch (_) {

  }
  if (isLogin.value) {
    drawPieChart(await getUserData());
  }
}

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

function drawPieChart(data) {
  nextTick(() => {
    const chartDom = document.getElementById('pieChart');
    const myChart = echarts.init(chartDom);
    let option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'User From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    option && myChart.setOption(option);
  });
}

const userCount = ref(0);
async function getUserData() {
  const q1 = query(collection(db, "users"), where("role", "==", "2"));
  const psychotherapists = await getDocs(q1);

  const q2 = query(collection(db, "users"), where("role", "==", "1"));
  const members = await getDocs(q2);

  userCount.value = psychotherapists.size + members.size;
  return [
    {value: psychotherapists.size, name: 'Psychotherapist'},
    {value: members.size, name: 'Member'},
  ]
}

onMounted(() => {
  localStorage.removeItem("currentAccount");
});
</script>

<template>
  <!-- Login Form -->
  <form v-if="!isLogin" class="mt-3 container-fluid col-6 d-flex flex-column gap-4 p-5 bg-body-secondary border rounded"
        @submit.prevent="submitForm">
    <h1 class="mb-1 font-monospace text-center">Login</h1>
    <!-- Username -->
    <div class="row">
      <label for="loginName" class="form-label">Username</label>
      <input type="text" maxlength="20" class="form-control" id="loginName"
             v-model="formData.username">
    </div>
    <!-- Password -->
    <div class="row">
      <label for="loginPassword" class="form-label">Password</label>
      <input type="password" maxlength="30" class="form-control" id="loginPassword"
             v-model="formData.password">
    </div>
    <div class="row justify-content-end">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </div>
  </form>

  <!-- After Login -->
  <div v-if="isLogin" class="container-fluid">
    <div class="row justify-content-start align-items-center mt-3">
      <h3>Total user count: {{ userCount }}</h3>
      <div id="pieChart" style="width: 400px;height:400px;"></div>
    </div>
  </div>
</template>

<style scoped>

</style>