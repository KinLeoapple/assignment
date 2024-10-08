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
      zoom: 15 // starting zoom
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

    const draw = new MapboxDraw({
      // Instead of showing all the draw tools, show only the line string and delete tools
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },
      // Set the draw mode to draw LineStrings by default
      defaultMode: 'draw_line_string',
      styles: [
        // Set the line style for the user-input coordinates
        {
          'id': 'gl-draw-line',
          'type': 'line',
          'filter': [
            'all',
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#438EE4',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
            'line-opacity': 0.7
          }
        },
        // Style the vertex point halos
        {
          'id': 'gl-draw-polygon-and-line-vertex-halo-active',
          'type': 'circle',
          'filter': [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'circle-radius': 12,
            'circle-color': '#FFF'
          }
        },
        // Style the vertex points
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'circle-radius': 8,
            'circle-color': '#438EE4'
          }
        }
      ]
    });

    // Add the draw tool to the map
    map.addControl(draw);

    // Add create, update, or delete actions
    map.on('draw.create', updateRoute);
    map.on('draw.update', updateRoute);
    map.on('draw.delete', removeRoute);

    // Use the coordinates you just drew to make the Map Matching API request
    function updateRoute() {
      removeRoute(); // Overwrite any existing layers

      const profile = 'driving'; // Set the profile

      // Get the coordinates
      const data = draw.getAll();
      const lastFeature = data.features.length - 1;
      const coords = data.features[lastFeature].geometry.coordinates;
      // Format the coordinates
      const newCoords = coords.join(';');
      // Set the radius for each coordinate pair to 25 meters
      const radius = coords.map(() => 25);
      getMatch(newCoords, radius, profile);
    }

    // Make a Map Matching request
    async function getMatch(coordinates, radius, profile) {
      // Separate the radiuses with semicolons
      const radiuses = radius.join(';');
      // Create the query
      const query = await fetch(
          `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxAccessToken}`,
          { method: 'GET' }
      );
      const response = await query.json();
      // Handle errors
      if (response.code !== 'Ok') {
        alert(
            `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
        );
        return;
      }
      const coords = response.matchings[0].geometry;
      // Draw the route on the map
      addRoute(coords);
      getInstructions(response.matchings[0]);
    }

    function getInstructions(data) {
      // Target the sidebar to add the instructions
      const directions = document.getElementById('directions');
      let tripDirections = '';
      // Output the instructions for each step of each leg in the response object
      for (const leg of data.legs) {
        const steps = leg.steps;
        for (const step of steps) {
          tripDirections += `<li>${step.maneuver.instruction}</li>`;
        }
      }
      directions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
          data.duration / 60
      )} min.</strong></p><ol>${tripDirections}</ol>`;
    }

    // Draw the Map Matching route as a new layer on the map
    function addRoute(coords) {
      // If a route is already loaded, remove it
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      } else {
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': coords
            }
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#03AA46',
            'line-width': 8,
            'line-opacity': 0.8
          }
        });
      }
    }

    // If the user clicks the delete draw button, remove the layer if it exists
    function removeRoute() {
      if (!map.getSource('route')) return;
      map.removeLayer('route');
      map.removeSource('route');
    }
  });
})
</script>

<template>
  <div id="map" style="position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;"></div>
  <div class="info-box" style="position: absolute;
        margin: 20px;
        width: 25%;
        top: 0;
        left: 0;
        bottom: 20px;
        padding: 20px;
        background-color: #fff;
        overflow-y: scroll;">
    <p>
      Draw your route using the draw tools on the right. To get the most
      accurate route match, draw points at regular intervals.
    </p>
    <div id="directions"></div>
  </div>
</template>

<style scoped>

</style>