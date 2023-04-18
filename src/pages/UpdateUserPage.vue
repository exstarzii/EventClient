<template>
  <q-page class=" UpdateUserPage row items-center justify-evenly text-white">
    <div class="q-pa-md container">
        <img class="profile" src="placeholder.png">
        <input v-model="nickname" type="text" placeholder="Nickname">
        <input v-model="surename" type="text" placeholder="surename">
        <input v-model="name" type="text" placeholder="name">
        <input v-model="email" type="email" placeholder="email">
        <input v-model="age" type="number" placeholder="age" min="1" max="99">
        <input v-model="phone" type="text" placeholder="phone">
        <div>
          <!-- <label><input name="sex" type="radio">man</label>
          <label><input name="sex" type="radio">women</label> -->
          <q-radio  dark  v-model="sex" val="man" label="man" color="accent"/>
          <q-radio  dark  v-model="sex" val="women" label="women" color="accent"/>
        </div>
        
        <input v-model="city" type="text" placeholder="city">
        <textarea v-model="about" type="text" placeholder="about"></textarea>
        <input class="button gradient" type="button" value="Submit" @click="confirm">
    </div>
  </q-page>
</template>

<script lang="ts">
import { store } from 'src/store';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UpdateUserPage',
  data() {
    return {
      nickname: '',
      photo: '',
      name: '',
      surename: '',
      email: '',
      age: '',
      phone: '',
      sex: '',
      city: '',
      about: '',
    }
  },
  mounted() {
    this.$axios.get(process.env.VUE_APP_BASE_URL + '/user', {
      headers: {
        Authorization: 'Bearer ' + store.token
      }
    })
      .then(response => {
        console.log(response);
        this.nickname = response.data.nickname
        this.photo = response.data.photo
        this.name = response.data.name
        this.surename = response.data.surename
        this.email = response.data.email
        this.age = response.data.age
        this.phone = response.data.phone
        this.sex = response.data.sex
        this.city = response.data.city
        this.about = response.data.about
      })
  },
  methods: {
    confirm() {
      this.$q.dialog({
        title: 'Deleting',
        message: 'Are you sure to delete account?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete();
      })
    },
    delete() {
      this.$axios.delete(process.env.VUE_APP_BASE_URL + '/user', {
        headers: {
          Authorization: 'Bearer ' + store.token
        }
      })
        .then(response => {
          console.log(response);
          this.$q.notify('Account has been deleted');
          store.token = '';
          this.$router.push({ path: '/' });
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$q.notify({
              color: 'negative',
              icon: 'report_problem',
              message: 'You are not logged in',
            })
          } else if (error.response.status == 404) {
            this.$q.notify({
              color: 'negative',
              icon: 'report_problem',
              message: 'The server is not available',
            })
          }
        })
    }
  }
});
</script>
