<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Test Auth Service </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered dark>
      <q-list>
        <q-item-label header> Login or Signup </q-item-label>
        <template v-if="token === ''">
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </template>
        <template v-else>
          <EssentialLink
            v-for="link in authlinksList"
            :key="link.title"
            v-bind="link"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

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
]);
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
    title: 'New event',
    icon: 'add_location',
    link: '/#/eventcreate',
  },
  {
    title: 'Log out',
    icon: 'logout',
    link: '/#/',
    onClick: () => {
      $q.cookies.set('token', '');
      token.value = '';
    },
  },
]);
onMounted(() => {
  token.value = $q.cookies.get('token');
  // console.log(token.value)
});

const leftDrawerOpen = ref(false);
const token = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
