<template>
  <q-layout view="lHh Lpr lFf" class="EventLayout">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Global Events
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-item-label header class="layout-title">
          Create new event
        </q-item-label>


        <label for="fileInput" class="profile" :style="{ backgroundImage: 'url(' + photo + ')' }" @click="chooseFile">
        </label>
        <input id="fileInput" style="display: none;" type="file" ref="fileInput" @change="handleFileUpload">
        <input v-model="name" type="text" placeholder="name">
        <!-- <input v-model="dateStart" type="text" placeholder="dateStart">
        <input v-model="dateEnd" type="text" placeholder="dateEnd"> -->
        <!-- calendar -->
        <div class="cursor-pointer">
          <span>date: {{ days.from }} - {{ days.to }}</span>
          <q-popup-edit v-model="label" class="bg-accent text-white" v-slot="scope"> <!--   -->
            <q-date v-model="days" range dark minimal today-btn color="accent" @range-end="scope.set" />
          </q-popup-edit>
        </div>
        <!-- participants  -->
        <!-- <div class="cursor-pointer">
          <span>participants:
            <span v-for="(participant, index) in participants" :key="index">
              {{ participant.nickname }}
            </span>
          </span>
          <q-popup-edit v-model="label" class="bg-accent text-white participants-popup" v-slot="scope">
            <input type="button" @click="scope.set">
          </q-popup-edit>
        </div> -->
        <!-- <input v-model="participants" type="number" placeholder="participants" min="1" max="99"> -->
        <input v-model="category" type="text" placeholder="category">
        <!-- <input v-model="location" type="text" placeholder="location"> -->
        <textarea v-model="description" type="text" placeholder="description"></textarea>
        <input class="button gradient" type="button" value="Submit" @click="onSubmit">
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar'
import axios from 'axios'
// author?: mongoose.Types.ObjectId;
// participants?: [mongoose.Types.ObjectId];
// _id?: string;
// location: { type: String;coordinates: Number[];};
// name: string;
// dateStart: string;
// dateEnd: string;
// category: string;
// images: string;
// description: string;
const $q = useQuasar()

const label = ref()
const participants = ref([])// [mongoId, mongoId..]
const photo = ref('placeholder.png')
const name = ref('')
// const dateStart = ref(Date.now().toString()) // Date.now().toString()
// const dateEnd = ref(Date.now().toString()) // Date.now().toString()
const days = ref({ from: '2023/04/23', to: '2023/04/24' })
const category = ref('')
const description = ref('')
const location = ref({ type: 'Point', coordinates: [56.6449, 43.4154] }) //{ type: 'Point', coordinates: [lin,lon]}

const token = ref('')
const selectedFile = ref('')
const fileInput = ref('')
const leftDrawerOpen = ref(false)
onMounted(() => {
  token.value = $q.cookies.get('token')
})
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(selectedFile.value);
  reader.onload = () => {
    photo.value = reader.result;
  }
};
const chooseFile = (event) => {
  fileInput.value.click();
};
function onSubmit() {
  axios.post(process.env.VUE_APP_BASE_URL + '/event', {
    // author?: mongoose.Types.ObjectId; optional need to del
    participants: participants.value,
    // _id?: string; optional need to del
    location: location.value,
    name: name.value,
    dateStart: Date.parse(days.value.from),
    dateEnd: Date.parse(days.value.to),
    category: category.value,
    images: photo.value,
    description: description.value,
  }, {
    headers: {
      Authorization: 'Bearer ' + token.value
    },
  }).then(response => {
    console.log(response);
    if (response.status == 201) {
      $q.notify('saved');
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
</script>
<style lang="scss">
.q-drawer {
  background-color: $bg3;
  color: $text1;
}

// .q-drawer__content {

// }
.q-scrollarea__content {
  background-color: $bg2;
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
}

div.layout-title {
  font-size: 1.5em;
  color: $text1;
  text-align: center;
}

.q-menu {
  padding: 0;
}
</style>