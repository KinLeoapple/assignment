<script setup>
import mapboxgl from 'mapbox-gl';
import {nextTick} from "vue";

nextTick(() => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const {latitude, longitude} = position.coords;

    const mapboxAccessToken = 'pk.eyJ1Ijoia2lubGVvYXBwbGUiLCJhIjoiY20yMXY2bThpMDBobzJxcTdkbWg4OTFsZiJ9.JhuzjESfYNjOiWCM_b7bOg'
    const map = new mapboxgl.Map({
      accessToken: mapboxAccessToken,
      container: 'map', // HTML container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [longitude, latitude], // starting position [lng, lat]
      zoom: 100 // starting zoom
    });

    const searchBox = new MapboxSearchBox();
    searchBox.accessToken = mapboxAccessToken;
    searchBox.options = {
      types: 'address,poi',
      proximity: [longitude, latitude]
    };
    searchBox.marker = true;
    searchBox.mapboxgl = mapboxgl;
    map.addControl(searchBox);
  });
})
</script>

<template>

</template>

<style scoped>

</style>