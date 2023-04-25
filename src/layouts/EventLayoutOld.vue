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

    <q-drawer v-model="eventDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-item-label header class="layout-title">
          {{ name }}
        </q-item-label>


        <label for="fileInput" class="profile" :style="{ backgroundImage: 'url(' + photo + ')' }">
        </label>
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
        <input v-model="category" type="text" placeholder="category">
        <textarea v-model="description" type="text" placeholder="description"></textarea>
        <!-- <input class="button gradient" type="button" value="Submit" @click="onSubmit"> -->
      </q-scroll-area>
    </q-drawer>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered dark>
      <q-list>
        <q-item-label header>
          Login or Signup
        </q-item-label>
        <template v-if="token === ''">
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </template>
        <template v-else>
          <EssentialLink v-for="link in authlinksList" :key="link.title" v-bind="link" />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar'
import api from 'src/api.js';
import EssentialLink from 'components/EssentialLink.vue';

const $q = useQuasar()

const label = ref()
const participants = ref([])// [mongoId, mongoId..]
const photo = ref('placeholder.png')
const name = ref('')
const days = ref({ from: '2023/04/23', to: '2023/04/24' })
const category = ref('')
const description = ref('')
const location = ref({ type: 'Point', coordinates: [56.6449, 43.4154] }) //{ type: 'Point', coordinates: [lin,lon]}
const token = ref('')
const leftDrawerOpen = ref(false)
const eventDrawerOpen = ref(false)
const essentialLinks = ref([
  {
    title: 'Authorization',
    icon: 'login',
    link: '/#/auth',
  },
  {
    title: 'Signup',
    icon: 'person_add',
    link: '/#/signup',
  },
])
const authlinksList = ref([
  {
    title: 'Account details',
    icon: 'person',
    link: '/#/userinfo',
  },
  {
    title: 'Events',
    icon: 'map',
    link: '/#/events',
  },
  {
    title: 'Log out',
    icon: 'logout',
    link: '/#/',
    onClick: () => {
      $q.cookies.set('token', '')
      token.value = ''
    }
  },
])
onMounted(() => {
  token.value = $q.cookies.get('token')
  // console.log(token.value)
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function toggleEventDrawer() {
  eventDrawerOpen.value = !eventDrawerOpen.value
}
function showEvent(event) {
  if (event == null || event == '') {
    return
  }
  console.log(event);
  participants.value = event.participants
  location.value = event.location
  name.value = event.name
  days.value.from = new Date(event.dateStart).toLocaleString()
  days.value.to = new Date(event.dateEnd).toLocaleString()
  category.value = event.category
  photo.value = event.images
  description.value = event.description
  toggleEventDrawer()
}
defineExpose({ showEvent })
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