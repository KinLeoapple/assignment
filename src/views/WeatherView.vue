<script setup>
import InteractiveDataTable from "@/components/InteractiveDataTable.vue";
import axios from "axios";
import {onMounted, ref} from "vue";

const apikey = "2919b8ada89fead5a3bceb9c9201c1f3";

const weathers = ref([]);

const columns = [
  {data: 'city', title: 'City'},
  {data: 'temperature', title: 'Temperature'},
  {data: 'description', title: 'Description'},
];

const cities = [
  {name: "Melbourne", "latitude": -37.813629, "longitude": 144.963058},
  {name: "Sydney", "latitude": -33.868820, "longitude": 151.209290},
  {name: "Gold Coast", "latitude": -28.016666, "longitude": 153.399994},
  {name: "Cairns", "latitude": -16.918550, "longitude": 145.778061},
  {name: "Brisbane", "latitude": -27.469770, "longitude": 153.025131},
  {name: "Perth", "latitude": -31.950527, "longitude": 115.860458},
  {name: "Adelaide", "latitude": -34.928497, "longitude": 138.600739},
  {name: "Hobart", "latitude": -42.882137, "longitude": 147.327194},
  {name: "Darwin", "latitude": 37.095142, "longitude": -95.582413},
  {name: "Canberra", "latitude": -35.280937, "longitude": 149.130005},
  {name: "Newcastle", "latitude": 54.978252, "longitude": -1.617780},
  {name: "Mildura", "latitude": -34.208015, "longitude": 142.124557},
  {name: "Daylesford", "latitude": -37.345531, "longitude": 144.146454},
]

const fetchLocationWeather = async (latitude, longitude) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
  await fetchWeatherData(url);
}

const fetchWeatherData = async (url) => {
  try {
    const response = await axios.get(url);
    let data = response.data;
    weathers.value.push({
      city: data.name + ", " + data.sys.country,
      temperature: (data
          ? Math.floor(data.main.temp - 273)
          : null ) + "°C",
      description: data.weather[0].description
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

onMounted(() => {
  cities.forEach((city) => {
    fetchLocationWeather(city.latitude, city.longitude);
  })
})
</script>

<template>
  <InteractiveDataTable :columns="columns" :data="weathers"/>
</template>

<style scoped>

</style>