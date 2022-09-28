<template lang="pug">
.login
  v-form.d-flex.justify-center(
    v-model="valid"
  )
    v-card(
      width="300"
    )
      v-card-text
        .text-h4 Login
        v-text-field.mt-4(
          label="Email"
          :rules="emailRules"
          v-model="email"
          required
        )
        v-text-field.mt-4(
          :rules="passwordRules"
          label="Password"
          v-model="password"
          type="password"
          required
        )
        v-btn(
          @click="logIn"
          :disabled="!valid"
          color="blue"
        )
          .text-white Login
</template>

<script setup lang="ts">
import UsersService from '~~/services/users-service'

const valid = ref(false)
const email = ref('')
const password = ref('')
const emailRules = [
  (value: string) => !!value || 'E-mail is required',
  (value: string) => /.+@.+/.test(value) || 'E-mail must be valid',
]
const passwordRules = [
  (value: string) => !!value || 'Password is required',
]

function logIn () {
  UsersService.login(email.value, password.value)
}
</script>

<style scoped lang="stylus">
</style>
