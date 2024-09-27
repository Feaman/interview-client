<template lang="pug">
.sign-page.full-width.full-height.mt-4(
  v-if="!isTokenExists"
  ref="rootElement"
)
  .row.flex-center.full-width.full-height
    .sign-page__container.column.flex-center.full-width.q-px-lg.rounded-borders.bg-white.py-4.ma-4
      h5.full-width.text-left.q-ma-none Sign {{ isSignIn ? 'In' : 'Up' }}
      .full-width(
        :class="`sign-page__sign-${isSignIn ? 'in' : 'up'}-form`"
      )
        .sign-page__form(
          v-if="isSignIn"
        )
          q-input.q-mt-lg(
            v-model="email"
            label="Email"
            type="email"
            :maxlength="RULE_1024_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="password"
            type="password"
            label="Password"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
        .sign-page__form(
          v-if="!isSignIn"
        )
          q-input.q-mt-lg(
            v-model="email"
            label="Email"
            type="email"
            :maxlength="RULE_1024_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="password"
            type="password"
            label="Password"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="firstName"
            label="First Name"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="secondName"
            label="Second Name"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
          q-file.mt-4(
            label="Photo"
            v-model="photo"
            outlined
          )
      .text-red.mt-4(
        v-if="errorText"
      ) {{ errorText }}

      q-btn.mt-4(
        @click="sign()"
        :loading="isLoading"
        :disable="!isValid"
        :label="`Sign ${isSignIn ? 'In' : 'Up'}`"
        color="primary"
      )
      .mt-4 OR
      q-btn.mt-2(
        @click="togglePage()"
        :label="`Sign ${isSignIn ? 'Up' : 'In'}`"
        flat
      )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsersService from '~/services/users-service'
import StorageService from '~/services/storage'
import KeyboardEvents from '~/helpers/keyboard-events'

const isTokenExists = StorageService.get(UsersService.AUTH_TOKEN_NAME)
const router = useRouter()

if (isTokenExists) {
  router.push('/')
}

const RULE_155_LENGTH = 155
const RULE_1024_LENGTH = 1024

const rootElement = ref<HTMLElement | null>(null)

const isSignIn = ref(true)
const email = ref('')
const password = ref('')
const firstName = ref('')
const secondName = ref('')
const photo = ref<File | undefined>(undefined)
const isLoading = ref(false)
const errorText = ref('')

function togglePage() {
  errorText.value = ''
  isSignIn.value = !isSignIn.value
}

const isValid = computed(() => {
  const isEmailAndPasswordValid = email.value && email.value.length <= RULE_1024_LENGTH
    && password.value && password.value.length <= RULE_155_LENGTH

  if (isSignIn.value) {
    return isEmailAndPasswordValid
  }

  return isEmailAndPasswordValid
    && firstName.value && firstName.value.length > 3 && firstName.value.length <= RULE_155_LENGTH
})

async function sign() {
  if (isValid.value) {
    isLoading.value = true
    try {
      if (isSignIn.value) {
        await UsersService.signIn(email.value, password.value)
      } else {
        const formData = new FormData()
        formData.append('email', email.value || '')
        formData.append('password', password.value)
        formData.append('firstName', firstName.value || '')
        formData.append('secondName', secondName.value || '')
        if (photo.value) {
          formData.append('photo', photo.value)
        }
        await UsersService.signUp(formData)
      }
      router.push('/')
    } catch (error) {
      errorText.value = ((error as { response: { data: { message: string }}}).response?.data?.message) || ((error as Error).message) || 'Unexpected error'
      isLoading.value = false
    }
  }
}

onMounted(() => {
  rootElement.value?.querySelectorAll('input').forEach(($input) => {
    $input.addEventListener('keypress', (event) => {
      if (KeyboardEvents.is(event, KeyboardEvents.ENTER)) {
        sign()
      }
    })
  })
})
</script>

<style lang="scss" scoped>
.sign-page {
  width: 500px;

  .sign-page__container {
    border: 1px solid #e0e0e0;
    max-width: 500px;

    .sign-page__sign-in-form,
    .sign-page__sign-up-form {
      position: relative;
    }

    .sign-page__form {
      max-width: 500px;
      width: 100%;
    }
  }
}
</style>
