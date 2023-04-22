<template>
    <div id="map" ref="map" class="map"></div>
    <label>latitude <input ref="lat" type="text"></label>
    <label>longitude <input ref="lon" type="text"></label>
    <input id="lon" type="button" @click="setPos" value="sub">
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useGeographic } from 'ol/proj.js';

useGeographic();
const map = ref(null);
const lon = ref(null);
const lat = ref(null);
const zoom = ref(10);
const center = ref([0, 0])

onMounted(() => {
    map.value = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: new View({
            center: center.value,
            zoom: zoom.value,
        }),
    });
    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        center.value = [longitude, latitude]
        const newView = new View({
            center: center.value,
            zoom: zoom.value
        });
        map.value.setView(newView);
    }, function (error) {
        console.error(error.message);
    });
});
function setPos() {
    console.log('inputs', [lat.value.value, lon.value.value])
    const newView = new View({
        center: [lon.value.value, lat.value.value],
        zoom: zoom.value
    });
    map.value.setView(newView);
}
</script>
<style>
.map {
    height: 500px;
}
</style>