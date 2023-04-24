<template>
    <!-- <div style="height:500px; width:700px"> -->
    <l-map ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false" @ready="setLocation">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
        </l-tile-layer>
        <l-marker v-for="(marker, index) in events" :key="index" :lat-lng="marker.location.coordinates" :draggable="true">
            <l-tooltip> {{ marker.name }} </l-tooltip>
        </l-marker>
    </l-map>
    <!-- </div> -->
</template>
  
<script setup>
import "leaflet/dist/leaflet.css";
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { useQuasar } from 'quasar';
import axios from 'axios'
// axios.interceptors.request.use(request => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request
// })

const $q = useQuasar()
const token = ref('')
const map = ref(null);
const zoom = ref(9);
const center = ref([47.41322, -1.219482]);
const events = ref([
    { location: { coordinates: [56.6449, 43.4954] }, name: "Marker1" },
    { location: { coordinates: [56.6649, 43.4354] }, name: "Marker2" },
    { location: { coordinates: [56.6849, 43.4554] }, name: "Marker3" }
]);

async function setLocation() {
    await new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                center.value[0] = position.coords.latitude;
                center.value[1] = position.coords.longitude;
                console.log(center.value)
                map.value.leafletObject.setView(center.value);
                res()
            },
            () => {
                console.log("Unable to get location!");
                rej()
            }
        );
    })
    axios.get(process.env.VUE_APP_BASE_URL + '/event', {
        headers: {
            Authorization: 'Bearer ' + token.value
        },
        params: {
            origin: [center.value[0], center.value[1]],
            radius: 50000
        }
    }).then(response => {
        console.log(response);
        if (response.status == 200) {
            $q.notify('get it');
            events.value = response.data;
        }
    }).catch((error) => {
        console.log(error.response);
        if (error.response.status == 404) {
            $q.notify({
                color: 'negative',
                icon: 'report_problem',
                message: 'The server is not available',
            });
        }
        else {
            error.response.data.message.forEach((mes) => {
                $q.notify({
                    color: 'negative',
                    icon: 'report_problem',
                    message: mes,
                });
            });
        }
    });
}
// потенциальные риски того что карта загрузиться быстрее чем onMounted
onMounted(() => {
    token.value = $q.cookies.get('token')
})
</script>
<style>
.q-page-container {
    height: 100vh;
}
</style>






