<template lang="pug">
.user-menu(v-if="user")
  PersonAvatar.cursor-pointer(
    :photoPath="user.photoPath"
    :initials="user.getInitials()"
    size="40px"
    color="purple-2"
    no-border
  )
    img(
      v-if="user.photoPath"
      :src="user.photoPath"
    )
    .text-black.text-weight-bold(
      v-else
    ) {{ user.getInitials() }}
  q-menu(
    style="width: 240px;"
  )
    .column.no-wrap
      .column.items-center.bg-grey-2.px-3.py-2.shadow-1
        PersonAvatar(
          :photoPath="user.photoPath"
          :initials="user.getInitials()"
          size="80px"
          color="purple-2"
        )
        .text-subtitle1.text-weight-bold.mt-1 {{ user.getFio() }}
        .text-grey-7 {{ user.email }}
      q-list(
        separator
      )
        q-item.font-size-16(
          @click="isShowAccount = true"
          clickable
        )
          q-item-section
            .row.items-center
              q-icon(
                :name="mdiAccount"
                color="black"
              )
              .cursor-pointer.py-1.ml-2 Account
        q-item.font-size-16(
          @click="router.push({ name: ROUTE_TEMPLATES })"
          clickable
        )
          q-item-section
            .row.items-center
              q-icon(
                :name="mdiWidgets"
                color="black"
              )
              .cursor-pointer.py-1.ml-2 Templates
        q-item.font-size-16(
          @click="signOut()"
          clickable
        )
          q-item-section
            .row.items-center
              q-icon(
                :name="mdiLogout"
                color="black"
              )
              .cursor-pointer.py-1.ml-2 Sign out

q-dialog(
  @hide="onAccountClose()"
  backdrop-filter="blur(4px)"
  v-model="isShowAccount"
)
  q-card(style="width: 350px;")
    q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
      .text-h6.text-uppercase User account
    q-separator
    q-card-section
      .text-h6 Credentials
        q-input.mt-2(
          v-model="email"
          label="Email"
          type="email"
          :maxlength="RULE_1024_LENGTH"
          counter
          clearable
          outlined
          dense
        )
        q-input.q-mt-lg(
          v-model="password"
          type="password"
          label="Password"
          :maxlength="RULE_155_LENGTH"
          counter
          clearable
          outlined
          dense
        )
      .text-h6.mt-4 Personal info
        q-input.mt-2(
          v-model="firstName"
          label="First Name"
          :maxlength="RULE_155_LENGTH"
          counter
          clearable
          outlined
          dense
        )
        q-input.q-mt-lg(
          v-model="secondName"
          label="Second Name"
          :maxlength="RULE_155_LENGTH"
          counter
          clearable
          outlined
          dense
        )
        .row.mt-4
          PersonAvatar.mb-4(
            v-if="currentAvatarPath"
            :photoPath="currentAvatarPath"
            size="40px"
            no-border
          )
          q-file(
            @update:modelValue="setPhoto"
            @rejected="onPhotoRejected"
            v-model="photo"
            :class="{ 'ml-2': currentAvatarPath }"
            :error="!!photoErrorText"
            :error-message="photoErrorText"
            :max-file-size="MAX_FILE_SIZE"
            class="col"
            label="Photo"
            accept=".jpg, image/*"
            outlined
            dense
          )
      .text-red.mt-6(
        v-if="errorText"
      ) {{ errorText }}
    q-card-actions(
      align="left"
    )
      q-btn(
        @click="updateUser()"
        :disabled="!isValid"
        :loading="isLoading"
        label="Update"
        color="primary"
        flat
      )
      q-space
      q-btn(
        label="Close"
        flat
        v-ripple
        v-close-popup
      )
</template>

<script setup lang="ts">
import { mdiAccount, mdiLogout, mdiWidgets } from '@quasar/extras/mdi-v6'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE_TEMPLATES } from '~/router/routes'
import { user } from '~/composables'
import UsersService from '~/services/users-service'

const RULE_155_LENGTH = 155
const RULE_1024_LENGTH = 1024
const MAX_FILE_SIZE = 2097152
const ERROR_FILE_SIZE = 'max-file-size'
const ERROR_FILE_TYPE = 'accept'

const photoErrorText = ref('')
const currentAvatarPath = ref(user.value?.photoPath)
const isShowMenu = ref(false)
const isShowAccount = ref(false)
const email = ref(user.value?.email)
const password = ref('')
const firstName = ref(user.value?.firstName)
const secondName = ref(user.value?.secondName)
const photo = ref<File | undefined>(undefined)
const isLoading = ref(false)
const errorText = ref('')
const router = useRouter()

const isValid = computed(() => {
  const isFieldsValid = (email.value && email.value.length <= RULE_1024_LENGTH)
    && (firstName.value && firstName.value.length <= RULE_155_LENGTH)
    && (secondName.value && secondName.value.length <= RULE_155_LENGTH)
  return isFieldsValid
})

function signOut() {
  UsersService.signOut()
}

function onAccountClose() {
  email.value = user.value?.email
  firstName.value = user.value?.firstName
  secondName.value = user.value?.secondName
  password.value = ''
  currentAvatarPath.value = user.value?.photoPath
}

function onPhotoRejected(rejectedEntries: { failedPropValidation: string }[]) {
  const errorType = rejectedEntries[0].failedPropValidation
  if (errorType === ERROR_FILE_SIZE) {
    photoErrorText.value = `Max file size is ${MAX_FILE_SIZE / 1024 / 1024} megabytes`
  }
  if (errorType === ERROR_FILE_TYPE) {
    photoErrorText.value = 'File is not an image'
  }
}

function setPhoto(file: File) {
  photoErrorText.value = ''
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    currentAvatarPath.value = reader.result as string
  }
  currentAvatarPath.value = file ? URL.createObjectURL(file) : ''
}

async function updateUser() {
  if (isValid.value) {
    isLoading.value = true
    try {
      const formData = new FormData()
      formData.append('email', email.value || '')
      formData.append('password', password.value)
      formData.append('firstName', firstName.value || '')
      formData.append('secondName', secondName.value || '')
      if (photo.value) {
        formData.append('photo', photo.value)
      }
      await UsersService.update(formData)
      isShowAccount.value = false
    } catch (error) {
      errorText.value = ((error as { response: { data: { message: string }}}).response?.data?.message) || ((error as Error).message) || 'Unexpected error'
    } finally {
      isLoading.value = false
    }
  }
}
</script>
