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

        <q-toolbar-title>
           Test Auth Service
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Login or Signup
        </q-item-label>
        <template  v-if="store.token.length==0">
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { store } from '../store';

const linksList = [
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
];
const authlinksList = [
  {
    title: 'Account details',
    icon: 'person',
    link: '/#/userinfo',
  },
  {
    title: 'Log out',
    icon: 'logout',
    link: '/#/',
    onClick: ()=>{
      store.token='';
    }
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      authlinksList: authlinksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      
    }
  },
  data(){
    return{
      store
    }
  }
});
</script>
