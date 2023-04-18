<template>
    <q-page class="AuthPage row items-center justify-evenly text-white">
        <div class="q-pa-md container">
            <div class="text1 text-center">Log in</div>
            <input v-model="nickname" type="text" placeholder="Nickname">
            <input v-model="code" type="text" placeholder="Code">
            <a class="text-center link" clickable tag="a" target="_self" href="/#/signup">sign up</a>
            <br>
            <input class="button gradient" type="button" value="Submit" @click="onSubmit">
        </div>
    </q-page>
    <FooterComp />
</template>

<script setup>
import FooterComp from 'src/components/FooterComp.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const nickname = ref('')
const code = ref('')
const $q = useQuasar()

function onSubmit() {
    console.log({
        nickname: nickname.value,
        code: code.value
    })
    axios.post(process.env.VUE_APP_BASE_URL + '/user/login', {
        nickname: nickname.value,
        code: code.value
    }).then(response => {
        console.log(response);
        $q.notify('Logged');
        //store.token = response.data.access_token;
        // const $q = useQuasar()
        $q.cookies.set('token', response.data.access_token)
        router.push({ path: '/userinfo' });
    }).catch((error) => {
        console.log(error)
        if (error.response.status == 401) {
            $q.notify({
                color: 'negative',
                icon: 'report_problem',
                message: 'Wrong login or password',
            });
        }
        else if (error.response.status == 404) {
            $q.notify({
                color: 'negative',
                icon: 'report_problem',
                message: 'The server is not available',
            });
        }
    });
}
</script>
