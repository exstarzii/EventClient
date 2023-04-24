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

<script setup>
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import api from 'src/api.js';

const $q = useQuasar()
const nickname = ref('')
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

  api.getUser($q)
    .then(response => {
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
  api.deleteUser($q)
}

</script>
