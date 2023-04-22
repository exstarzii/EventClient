<template>
  <q-page class=" UpdateUserPage row items-center justify-evenly text-white">
    <div class="q-pa-md container">
      <label for="fileInput" class="profile" :style="{ backgroundImage: 'url(' + photo + ')' }" @click="chooseFile">
      </label>
      <input id="fileInput" style="display: none;" type="file" ref="fileInput" @change="handleFileUpload">
      <input :value="nickname" type="text" placeholder="Nickname" read-only>
      <input :value="phone" type="text" placeholder="phone" read-only>
      <input v-model="surename" type="text" placeholder="surename">
      <input v-model="name" type="text" placeholder="name">
      <input v-model="email" type="email" placeholder="email">
      <input v-model="age" type="number" placeholder="age" min="1" max="99">
      <div>
        <!-- <label><input name="sex" type="radio">man</label>
          <label><input name="sex" type="radio">women</label> -->
        <q-radio dark v-model="sex" val="man" label="man" color="accent" />
        <q-radio dark v-model="sex" val="women" label="women" color="accent" />
      </div>

      <input v-model="city" type="text" placeholder="city">
      <textarea v-model="about" type="text" placeholder="about"></textarea>
      <input class="button gradient" type="button" value="Submit" @click="onSubmit">
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import axios from 'axios'
import { onMounted, ref } from 'vue';

const router = useRouter()
const $q = useQuasar()
const nickname = ref('')
const photo = ref('placeholder.png')
const name = ref('')
const surename = ref('')
const email = ref('')
const age = ref('')
const phone = ref('')
const sex = ref('')
const city = ref('')
const about = ref('')
const token = ref('')
const selectedFile = ref('')
const fileInput = ref('')

onMounted(() => {
  token.value = $q.cookies.get('token')
  axios.get(process.env.VUE_APP_BASE_URL + '/user', {
    headers: {
      Authorization: 'Bearer ' + token.value
    }
  }).then(response => {
    console.log(response);
    nickname.value = response.data.nickname
    photo.value = response.data.photo
    name.value = response.data.name
    surename.value = response.data.surename
    email.value = response.data.email
    age.value = response.data.age
    phone.value = response.data.phone
    sex.value = response.data.sex
    city.value = response.data.city
    about.value = response.data.about
  })
})
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
  axios.put(process.env.VUE_APP_BASE_URL + '/user', {
    nickname: nickname.value,
    phone: phone.value,
    photo: photo.value,
    name: name.value,
    surename: surename.value,
    email: email.value,
    age: age.value,
    sex: sex.value,
    city: city.value,
    about: about.value,
  }, {
    headers: {
      Authorization: 'Bearer ' + token.value
    },
  }).then(response => {
    console.log(response);
    if (response.status == 200) {
      $q.notify('saved');
      router.push({ path: '/userinfo' });
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
