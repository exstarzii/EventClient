<template>
    <q-page class="CreateEventPage row items-center justify-evenly text-white">
        <div v-if="count == 0" class="q-pa-md container">
            <label for="fileInput" class="profile" :style="{ backgroundImage: 'url(' + photo + ')' }" @click="chooseFile">
            </label>
            <input id="fileInput" style="display: none" type="file" ref="fileInput" @change="handleFileUpload" />
            <input v-model="name" type="text" placeholder="name" />
            <input class="button gradient" type="button" value="Next" @click="count++" />
            <input class="button gradient" type="button" value="Cancel" @click="count = 0" />
        </div>
        <div v-if="count == 1" class="q-pa-md container">
            <!-- calendar -->
            <div class="cursor-pointer">
                <!-- <span>date: {{ days.from }} - {{ days.to }}</span> -->
                Event's date
            </div>
            <!-- <q-popup-edit
          v-model="label"
          class="bg-accent text-white"
          v-slot="scope"
        > -->
            <q-date v-model="days" range dark minimal today-btn color="accent" />
            <!-- </q-popup-edit>  @range-end="scope.set"  -->

            <input class="button gradient" type="button" value="Next" @click="count++" />
            <input class="button gradient" type="button" value="Cancel" @click="count = 0" />
        </div>
        <div v-if="count == 2" class="q-pa-md container">
            <!-- participants  -->
            <div class="cursor-pointer">
                <span>participants:
                    <span v-for="(participant, index) in participants" :key="index">
                        {{ participant.nickname }}
                    </span>
                </span>
                <!-- <q-popup-edit v-model="label" class="bg-accent text-white participants-popup" v-slot="scope">
            <input type="button" @click="scope.set">
          </q-popup-edit> -->
            </div>
            <input class="button gradient" type="button" value="Next" @click="count++" />
            <input class="button gradient" type="button" value="Cancel" @click="count = 0" />
        </div>
        <div v-if="count == 3" class="q-pa-md container">
            <!-- <input v-model="participants" type="number" placeholder="participants" min="1" max="99"> -->
            <input v-model="category" type="text" placeholder="category" />
            <!-- <input v-model="location" type="text" placeholder="location"> -->
            <textarea v-model="description" type="text" placeholder="description"></textarea>
            <input class="button gradient" type="button" value="Submit" @click="onSubmit" />
            <input class="button gradient" type="button" value="Cancel" @click="count = 0" />
        </div>
    </q-page>
    <FooterComp />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import api from 'src/api.js';
import FooterComp from 'src/components/FooterComp.vue';
// author?: mongoose.Types.ObjectId;
// participants?: [mongoose.Types.ObjectId];
// _id?: string;
// location: { type: String;coordinates: Number[];};
// name: string;
// dateStart: string;
// dateEnd: string;
// category: string;
// images: string;
// description: string;
const $q = useQuasar();

const count = ref(0);
const label = ref();
const participants = ref([]); // [mongoId, mongoId..]
const photo = ref('placeholder.png');
const name = ref('');
// const dateStart = ref(Date.now().toString()) // Date.now().toString()
// const dateEnd = ref(Date.now().toString()) // Date.now().toString()
const days = ref({ from: '2023/04/23', to: '2023/04/24' });
const category = ref('');
const description = ref('');
const location = ref({ type: 'Point', coordinates: [56.6449, 43.4154] }); //{ type: 'Point', coordinates: [lin,lon]}

const token = ref('');
const selectedFile = ref('');
const fileInput = ref('');
onMounted(() => {
    token.value = $q.cookies.get('token');
});
const handleFileUpload = (event) => {
    console.log(event.target);
    selectedFile.value = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile.value);
    reader.onload = () => {
        photo.value = reader.result;
    };
};
const chooseFile = () => {
    fileInput.value.click();
};
function onSubmit() {
    const body = {
        // author?: mongoose.Types.ObjectId; optional need to del
        participants: participants.value,
        // _id?: string; optional need to del
        location: location.value,
        name: name.value,
        dateStart: Date.parse(days.value.from),
        dateEnd: Date.parse(days.value.to),
        category: category.value,
        images: photo.value,
        description: description.value,
    };
    api.createEvent($q, body);
}
</script>
<style>
.CreateEventPage .container {
    width: auto;
    min-height: 425px;
    min-width: 261px;
}
</style>