<template>
    <!-- <div style="height:500px; width:700px"> -->
    <l-map ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false" @ready="setLocation">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
        </l-tile-layer>
        <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.location" :draggable="true">
            <l-tooltip> {{ marker.text }} </l-tooltip>
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
axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

const $q = useQuasar()
const token = ref('')
const map = ref(null);
const zoom = ref(9);
const center = ref([47.41322, -1.219482]);
const markers = ref([
    { location: [56.6449, 43.4954], text: "Marker1" },
    { location: [56.6649, 43.4354], text: "Marker2" },
    { location: [56.6849, 43.4554], text: "Marker3" }
]);

const setLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            center.value[0] = position.coords.latitude;
            center.value[1] = position.coords.longitude;
            console.log(center.value)
            map.value.leafletObject.setView(center.value);
        },
        () => {
            console.log("Unable to get location!");
        }
    );
    axios.get(process.env.VUE_APP_BASE_URL + '/event', {
        headers: {
            Authorization: 'Bearer ' + token.value
        },
        params: {
            origin: [center.value[0], center.value[1]],
            radius: 4
        }
    }).then(response => {
        console.log(response);
        if (response.status == 200) {
            $q.notify('get it');
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
// потенциадбные риски того что карта загрузиться быстрее чем onMounted
onMounted(() => {
    token.value = $q.cookies.get('token')

})
</script>
<style>
.q-page-container {
    height: 100vh;
}
</style>






