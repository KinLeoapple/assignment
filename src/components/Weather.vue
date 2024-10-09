<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import axios from "axios";

const apikey = "2919b8ada89fead5a3bceb9c9201c1f3";

const weatherData = ref(null);

const temperature = computed(() => {
  return weatherData.value
      ? Math.floor(weatherData.value.main.temp - 273)
      : null;
});

const iconUrl = computed(() => {
  return weatherData.value
      ? `http://api.openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
      : null;
});

const fetchCurrentLocationWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const {latitude, longitude} = position.coords;
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
      await fetchWeatherData(url);
    });
  }
}

const fetchWeatherData = async (url) => {
  try {
    const response = await axios.get(url);
    weatherData.value = response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

onMounted(() => {
  fetchCurrentLocationWeather();
});
</script>

<template>
  <div class="row justify-content-between mt-3">
    <div v-if="weatherData">
      <h2>
        {{ weatherData.name }}, {{ weatherData.sys.country }}
      </h2>
      <div>
        <img :src="iconUrl" alt="Weather Icon"/>
        <p>{{ temperature }} °C</p>
      </div>
      <span>{{ weatherData.weather[0].description }}</span>
    </div>

  </div>
</template>

<style scoped>

</style>