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
        .text-red.mb-4(v-if="errorMessage") {{ errorMessage }}
        .d-flex.align-center
          v-btn(
            @click="logIn"
            :disabled="!valid"
            color="blue"
          )
            .text-white Login
          .mx-2 OR
          v-btn(
            @click="$router.push('/register')"
            flat
          )
            strong Register
</template>

<script setup lang="ts">
import UsersService from '~~/services/users-service'

const valid = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const emailRules = [
  (value: string) => !!value || 'E-mail is required',
  (value: string) => /.+@.+/.test(value) || 'E-mail must be valid',
]
const passwordRules = [
  (value: string) => !!value || 'Password is required',
]

async function logIn () {
  errorMessage.value = ''
  try {
    await UsersService.login(email.value, password.value)
  } catch (error) {
    errorMessage.value = error?.data?.message || error.message || 'Undefined error'
  }
}
</script>
