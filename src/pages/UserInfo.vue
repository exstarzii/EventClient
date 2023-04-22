<template>
  <q-page class=" UserInfoPage  row items-center justify-evenly text-white">
    <div class="q-pa-md container">
      <table class="table">
        <caption><img @src="photo">{{ nickname }} Info</caption>
        <tr v-for="row in ShownRows" :key="row.col1">
          <td>{{ row.col1 }}</td>
          <td>{{ row.col2 }}</td>
        </tr>
      </table>
      <div class="q-pa-md q-gutter-sm">
        <a href='/#/userupdate'><input class="button gradient" type="button" value="Edit Info"></a>
        <input class="button deleteButton" type="button" value="Delete Account" @click="Confirm">
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import axios from 'axios'
import { computed, onMounted, ref } from 'vue';

const $q = useQuasar()
const router = useRouter()
const nickname = ref('')
const token = ref('')
const photo = ref('')
const rows = ref([
  {
    col1: 'Name',
    col2: '',
  },
  {
    col1: 'Surename',
    col2: '',
  },
  {
    col1: 'Email',
    col2: '',
  },
  {
    col1: 'Age',
    col2: '',
  },
  {
    col1: 'Phone',
    col2: '',
  },
  {
    col1: 'Sex',
    col2: '',
  },
  {
    col1: 'City',
    col2: '',
  },
  {
    col1: 'About',
    col2: '',
  },
])
const ShownRows = computed(() => {
  return rows.value.filter((row) => {
    return row.col2 > ''
  })
})

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
    rows.value[0].col2 = response.data.name
    rows.value[1].col2 = response.data.surename
    rows.value[2].col2 = response.data.email
    rows.value[3].col2 = response.data.age
    rows.value[4].col2 = response.data.phone
    rows.value[5].col2 = response.data.sex
    rows.value[6].col2 = response.data.city
    rows.value[7].col2 = response.data.about
  }).catch((error) => {
    if (!error.status) {
      $q.notify({
        color: 'negative',
        icon: 'report_problem',
        message: 'The server is not available',
      })
    } else if (error.response.status == 401) {
      $q.notify({
        color: 'negative',
        icon: 'report_problem',
        message: 'You are not logged in',
      })
    } else if (error.response.status == 404) {
      $q.notify({
        color: 'negative',
        icon: 'report_problem',
        message: 'The server is not available',
      })
    }
  })
})

function Confirm() {
  $q.dialog({
    title: 'Deleting',
    message: 'Are you sure to delete account?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    Delete();
  })
}
function Delete() {
  axios.delete(process.env.VUE_APP_BASE_URL + '/user', {
    headers: {
      Authorization: 'Bearer ' + token.value
    }
  }).then(response => {
    console.log(response);
    $q.notify('Account has been deleted');
    token.value = '';
    $q.cookies.set('token', '')
    router.push({ path: '/' });
  }).catch((error) => {
    if (error.response.status == 401) {
      $q.notify({
        color: 'negative',
        icon: 'report_problem',
        message: 'You are not logged in',
      })
    } else if (error.response.status == 404) {
      $q.notify({
        color: 'negative',
        icon: 'report_problem',
        message: 'The server is not available',
      })
    }
  })
}

</script>
