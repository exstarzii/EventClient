<template>
    <q-page class="SignupPage row items-center justify-evenly text-white">
        <div class="q-pa-md container">
            <div class="text1 text-center">Sign up</div>
            <input name="nickname" type="text" v-model="nickname" placeholder="Nickname">
            <input name="phone" type="text" v-model="phone" placeholder="Phone">
            <a class="text-center link" clickable tag="a" target="_self" href="/#/auth">sign in</a>
            <div class="note text-center">
                after registration, a verification code will be sent to your phone
            </div>
            <input class="button gradient" type="submit" value="Submit" @click="onSubmit">
        </div>
    </q-page>
    <FooterComp />
</template>


<script setup lang="ts">
import FooterComp from 'src/components/FooterComp.vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import axios from 'axios'
import { ref } from 'vue';

const router = useRouter()
const $q = useQuasar()
const nickname = ref('')
const phone = ref('')

function onSubmit() {
    axios.post(process.env.VUE_APP_BASE_URL + '/user', {
        nickname: nickname.value,
        phone: phone.value,
    }).then(response => {
        console.log(response);
        if (response.status == 201) {
            $q.notify('Account created');
            router.push({ path: '/userinfo?nickname=' + nickname.value });
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
            error.response.data.message.forEach((mes: string) => {
                $q.notify({
                    color: 'negative',
                    icon: 'report_problem',
                    message: mes,
                });
            });
        }
    });
}
function PhoneVerify() {
    axios.post(process.env.VUE_APP_BASE_URL + '/user/phoneVerify', {
        nickname: nickname.value,
    }).then(response => {
        console.log(response);
        if (response.status == 201) {
            $q.notify('Account created');
            router.push({ path: '/userinfo?nickname=' + nickname.value });
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
            error.response.data.message.forEach((mes: string) => {
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

