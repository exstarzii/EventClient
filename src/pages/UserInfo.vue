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
        <input class="button deleteButton" type="button" value="Delete Account" @click="confirm">
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
// import { store } from 'src/store';
import { defineComponent } from 'vue';

const $q = useQuasar()
const columns = [
  { name: 'col1', align: 'left', label: '', field: 'col1' },
  { name: 'col2', align: 'left', label: '', field: 'col2' },
]


export default defineComponent({
  setup() {
    return {
      columnsT: columns,
    }
  },
  data() {
    return {
      nickname: '',
      token: '',
      photo: '',
      rows: [
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
      ]
    }
  },
  mounted() {
    this.token = $q.cookies.get('token')
    this.$axios.get(process.env.VUE_APP_BASE_URL + '/user', {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    })

      .then(response => {
        console.log(response);
        this.nickname = response.data.nickname
        this.photo = response.data.photo
        this.rows[0].col2 = response.data.name
        this.rows[1].col2 = response.data.surename
        this.rows[2].col2 = response.data.email
        this.rows[3].col2 = response.data.age
        this.rows[4].col2 = response.data.phone
        this.rows[5].col2 = response.data.sex
        this.rows[6].col2 = response.data.city
        this.rows[7].col2 = response.data.about
      })
  },
  computed: {
    ShownRows: function () {
      return this.rows.filter(function (row) {
        return row.col2 > ''
      })
    }
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
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          console.log(response);
          this.$q.notify('Account has been deleted');
          this.token = '';
          $q.cookies.set("token", '')
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
