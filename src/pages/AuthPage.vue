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
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar'
import api from 'src/api.js';

const router = useRouter()
const nickname = ref('')
const code = ref('')
const $q = useQuasar()
onMounted(() => {
    if (router.currentRoute.value.query.nickname) {
        nickname.value = router.currentRoute.value.query.nickname
    }
})

function onSubmit() {
    console.log({
        nickname: nickname.value,
        code: code.value
    })
    api.loginUser($q, router, nickname.value, code.value);
}
</script>
