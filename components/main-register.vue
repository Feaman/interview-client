<template lang="pug">
.login
  v-form.d-flex.justify-center(
    v-model="valid"
  )
    v-card(
      width="300"
    )
      v-card-text
        .text-h4 Register
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
        v-text-field.mt-4(
          :rules="firstNameRules"
          label="First name"
          v-model="firstName"
          required
        )
        v-text-field.mt-4(
          :rules="secondNameRules"
          label="Second name"
          v-model="secondName"
          required
        )
        .text-red.mb-4(v-if="errorMessage") {{ errorMessage }}
        .d-flex.align-center
          v-btn(
            @click="register"
            :disabled="!valid"
            color="blue"
          )
            .text-white Register
          .mx-2 OR
          v-btn(
            @click="$router.push('/login')"
            flat
          )
            strong Login
</template>

<script setup lang="ts">
import UsersService from '~~/services/users-service'

const valid = ref(false)
const errorMessage = ref('')
const email = ref('')
const password = ref('')
const firstName = ref('')
const secondName = ref('')

const emailRules = [
  (value: string) => !!value || 'E-mail is required',
  (value: string) => /.+@.+/.test(value) || 'E-mail must be valid',
]

const passwordRules = [
  (value: string) => !!value || 'Password is required',
]

const firstNameRules = [
  (value: string) => (!!value && value.length > 2) || 'First name is required and should contain at least 3 symbols',
]

const secondNameRules = [
  (value: string) => (!!value && value.length > 2) || 'Second name is required and should contain at least 3 symbols',
]

async function register () {
  errorMessage.value = ''
  try {
    await UsersService.register(email.value, password.value, firstName.value, secondName.value)
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
