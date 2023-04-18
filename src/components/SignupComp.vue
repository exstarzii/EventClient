<template>
  <div class="q-pa-md" style="max-width: 400px">
    
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      ref="myForm"
      
    >
      <q-input
        filled
        ref="nameRef"
        type="text"
        v-model="username"
        label="Name "
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your name',
        ]"
      >
      </q-input>

      <q-input
        filled
        ref="emailRef"
        type="email"
        v-model="email"
        label="Email "
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your email',
        ]"
      >
      </q-input>

      <q-input 
        filled
        :hint = "updateMod?'leave it blank if you dont want to change your password':' ' "
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
        label="Password "
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-input
        filled
        v-model="phone"
        label="Phone"
        mask="# (###) ### - ####"
        fill-mask
        :rules="[
          val => val !== null && val !== '' || 'Please type your phone',
        ]"
      />
      
      <q-input
        filled
        type="textarea"
        v-model="about"
        label="About you "
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script lang="ts">
import { store } from 'src/store'
import { defineComponent } from 'vue'
import { User } from './models'

export default defineComponent({
  name: 'SignupComp',
  props: {
    usernamep: String,
    emailp: String,
    phonep: String,
    aboutp: String,
    passwordp:String,
    updateMod:Boolean,
  },
   data(props){
      return {
        isPwd: true,
        username : props.usernamep,
        email: props.emailp,
        phone: props.phonep,
        about: props.aboutp,
        password: props.passwordp,
      }
   },
   methods: {
    onSubmit() {
      if(this.updateMod){
        let body:User ={
          username: this.username,
          email : this.email,
          phone: this.phone, 
          about: this.about, 
        }
        if(this.password){
          body.password=this.password;
        }
        this.$axios.put(process.env.VUE_APP_BASE_URL+'/user',
          body,
          {headers: {
            Authorization: 'Bearer ' + store.token
          }}
        ).then(response => {
          console.log(response);
          if(response.status == 200){
            this.$q.notify('Account updated');
          }
        })
        .catch( (error) => {
          console.log(error.response)
          if(error.response.status == 404){
            this.$q.notify({
            color:  'negative',
            icon:'report_problem',
            message:'The server is not available',
            })
          }
          else {
            error.response.data.message.forEach( (mes:string) =>{
              this.$q.notify({
                color:  'negative',
                icon:'report_problem',
                message:mes,
              })
            })
          }
        })
      }
      else
        this.$axios.post(process.env.VUE_APP_BASE_URL+'/user/signup',
        {
          username: this.username,
          email : this.email,
          phone: this.phone, 
          about: this.about, 
          password : this.password 
        },
        {headers: {
          Authorization: 'Bearer ' + store.token
        }}
        ).then(response => {
          console.log(response);
          if(response.status == 201){
            this.$q.notify('Account created');
          }
        })
        .catch( (error) => {
          console.log(error.response)
          if(error.response.status == 404){
            this.$q.notify({
            color:  'negative',
            icon:'report_problem',
            message:'The server is not available',
            })
          }
          else {
            error.response.data.message.forEach( (mes:string) =>{
              this.$q.notify({
                color:  'negative',
                icon:'report_problem',
                message:mes,
              })
            })
          }
        })
    },
    onReset() {
      // update component state
      this.email= ''
      this.username= ''
      this.phone= '' 
      this.about= '' 
      this.password= '' 
    },
  },
  watch: {
    // whenever question changes, this function will run
    usernamep(newVal) {
      this.username = newVal;
    },
    emailp(newVal) {
      this.email = newVal;
    },
    phonep(newVal) {
      this.phone = newVal;
    },
    aboutp(newVal) {
      this.about = newVal;
    },
    passwordp(newVal) {
      this.password = newVal;
    },
  },
})
</script>
