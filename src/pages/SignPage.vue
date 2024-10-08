<template lang="pug">
.sign-page.full-width.full-height(
  v-if="!isTokenExists"
  ref="rootElement"
)
  .row.flex-center
    q-card.full-width.sign-page__container.shadow-0(
      bordered
    )
      q-card-section
        .text-h6.text-uppercase.text-center.text-primary {{ t('web service for conducting interviews') }}
  .row.flex-center.full-width.full-height
    .sign-page__container.column.flex-center.full-width.q-px-lg.rounded-borders.bg-white.py-4.ma-4
      h5.full-width.text-left.q-ma-none {{ t(`Sign ${isSignIn ? 'In' : 'Up'}`) }}
      .full-width(
        :class="`sign-page__sign-${isSignIn ? 'in' : 'up'}-form`"
      )
        .sign-page__form(
          v-if="isSignIn"
        )
          q-input.q-mt-lg(
            v-model="email"
            :label="t('Email')"
            type="email"
            name="email"
            :maxlength="RULE_1024_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="password"
            type="password"
            :label="t('Password')"
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
            :label="t('Email')"
            type="email"
            :maxlength="RULE_1024_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="password"
            type="password"
            :label="t('Password')"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="firstName"
            :label="t('First name')"
            :maxlength="RULE_155_LENGTH"
            :hint="t('At least 3 letters')"
            counter
            clearable
            outlined
          )
          q-input.q-mt-lg(
            v-model="secondName"
            :label="t('Second name')"
            :maxlength="RULE_155_LENGTH"
            counter
            clearable
            outlined
          )
          q-file.mt-4(
            @rejected="onPhotoRejected"
            v-model="photo"
            :label="t('Photo')"
            :error="!!photoErrorText"
            :error-message="photoErrorText"
            :max-file-size="MAX_FILE_SIZE"
            :hint="`${t('Max file size is')} ${MAX_FILE_SIZE / 1024 / 1024}${t('MB')}`"
            accept=".jpg, image/*"
            outlined
          )
      .text-red.mt-4(
        v-if="errorText"
      ) {{ t(errorText) }}

      q-btn.mt-4(
        @click="sign()"
        :loading="isLoading"
        :disable="!isValid"
        :label="t(`Sign ${isSignIn ? 'In' : 'Up'}`)"
        color="primary"
      )
      .mt-4 {{ t('OR') }}
      q-btn.mt-2(
        @click="togglePage()"
        :label="t(`Sign ${!isSignIn ? 'In' : 'Up'}`)"
        flat
      )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsersService from '~/services/users-service'
import StorageService from '~/services/storage'
import KeyboardEvents from '~/helpers/keyboard-events'
import { t } from '~/services/translate'

defineOptions({
  name: 'SignPage',
})

const isTokenExists = StorageService.get(UsersService.AUTH_TOKEN_NAME)
const router = useRouter()

if (isTokenExists) {
  router.push('/')
}

const RULE_155_LENGTH = 155
const RULE_1024_LENGTH = 1024
const MAX_FILE_SIZE = 2097152
const ERROR_FILE_SIZE = 'max-file-size'
const ERROR_FILE_TYPE = 'accept'

const rootElement = ref<HTMLElement | null>(null)

const isSignIn = ref(true)
const email = ref('')
const password = ref('')
const firstName = ref('')
const secondName = ref('')
const photo = ref<File | undefined>(undefined)
const isLoading = ref(false)
const errorText = ref('')
const photoErrorText = ref('')

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

function onPhotoRejected(rejectedEntries: { failedPropValidation: string }[]) {
  const errorType = rejectedEntries[0].failedPropValidation
  if (errorType === ERROR_FILE_TYPE) {
    photoErrorText.value = t('File is not an image')
  } else if (errorType === ERROR_FILE_SIZE) {
    photoErrorText.value = `${t('Max file size is')} ${MAX_FILE_SIZE / 1024 / 1024}${t('MB')}`
  }
}

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
