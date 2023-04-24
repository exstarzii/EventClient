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
import { ref } from 'vue';
import api from 'src/api.js';

const router = useRouter()
const $q = useQuasar()
const nickname = ref('')
const phone = ref('')

function onSubmit() {
    api.createUser($q, router, nickname.value, phone.value);
}
</script>

