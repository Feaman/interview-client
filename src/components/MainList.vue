<template lang="pug">
.main-page(
  :class="{ 'is-mobile': isMobile }"
)
  q-list.interviews.rounded-borders.bg-white.my-4(
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
    separator
  )
    q-item(
      v-for="candidate in candidatesSorted"
      @click="openCandidate(candidate)"
      clickable
      v-ripple
    )
      <q-item-section avatar>
        PersonAvatar(
          :photoPath="candidate.photoPath"
          :initials="candidate.getInitials()"
          size="48px"
        )
      </q-item-section>

      q-item-section.pa-1
        q-item-label.font-size-16.text-grey-9 {{ candidate.getFio() }}
        q-item-section.text-grey(
          lines="1"
          caption
        ) {{ getDateTime(candidate) }}

      q-item-section(
        side
      )
        q-btn(
          @click.stop="openRemoveDialog(candidate)"
          :icon="mdiClose"
          flat
          round
        )

  q-page-sticky(
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      @click="openDialog()"
      color="accent"
      icon="add"
      fab
    )

q-dialog(
  backdrop-filter="blur(4px)"
  v-model="isDialogShown"
)
  q-card.add-dialog
    q-card-section.row.items-center.q-pb-none.text-h6 New candidate
    q-card-section
      q-input(
        label="First name"
        v-model="firstName"
        hint="At least 3 letters"
        outlined
        dense
      )
      q-input.mt-4(
        label="Second Name"
        v-model="secondName"
        outlined
        dense
      )
      q-file.mt-4(
        label="Photo"
        v-model="photo"
        :max-file-size="MAX_FILE_SIZE"
        :hint="`Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`"
        accept=".jpg, image/*"
        outlined
        dense
      )
    q-card-actions(
      align="left"
    )
      q-btn(
        @click="add()"
        :disabled="firstName.length < 3"
        :loading="isCandidateLoading"
        label="Create"
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

q-dialog(
  backdrop-filter="blur(4px)"
  v-model="isRemoveDialogShown"
)
  q-card
    q-card-section.row.items-center.q-pb-none.text-h6 Delete candidate
    q-card-section
      q-list.interviews.rounded-borders(
        bordered
      )
        q-item.px-3
          q-item-section(avatar)
            PersonAvatar(
              :photoPath="candidateToRemove.photoPath"
              :initials="candidateToRemove.getInitials()"
              size="48px"
            )

          q-item-section.pa-1
            q-item-label.font-size-16.text-grey-9 {{ candidateToRemove.getFio() }}
            q-item-section.text-grey(
              lines="1"
              caption
            ) {{ getDateTime(candidateToRemove) }}
    q-card-actions(
      align="left"
    )
      q-btn(
        @click="removeCandidate()"
        :loading="isCandidateLoading"
        label="Delete"
        color="red"
        flat
        v-close-popup
      )
      q-space
      q-btn(
        label="Close"
        flat
        v-close-popup
      )
</template>

<script setup lang="ts">
import { mdiClose } from '@quasar/extras/mdi-v6'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import questions from '~/data.json'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import { ROUTE_CANDIDATE } from '~/router/routes'
import { candidates, isCandidateLoading, isMobile } from '~/composables'

const MAX_FILE_SIZE = 2097152
const ERROR_FILE_SIZE = 'max-file-size'
const ERROR_FILE_TYPE = 'accept'

const photoErrorText = ref('')
const isDialogShown = ref(false)
const firstName = ref('')
const secondName = ref('')
const photo = ref<File | undefined>(undefined)
const isRemoveDialogShown = ref(false)
const candidateToRemove = ref<CandidateModel | null>(null)
const candidatesSorted = computed(() => candidates.value.sort((previousItem, nextItem) => Number(nextItem.id) - Number(previousItem.id)))
const router = useRouter()

function openCandidate(candidate: CandidateModel) {
  router.push({ name: ROUTE_CANDIDATE, params: { id: String(candidate.id) } })
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

function openDialog() {
  firstName.value = ''
  secondName.value = ''
  photo.value = undefined
  isDialogShown.value = true
}

async function add() {
  const formData = new FormData()
  formData.append('firstName', firstName.value)
  formData.append('secondName', secondName.value)
  formData.append('data', JSON.stringify(questions))
  if (photo.value) {
    formData.append('photo', photo.value)
  }
  const candidate = await CandidateService.create(formData)
  candidates.value.push(candidate)
  isDialogShown.value = false
}

function openRemoveDialog(candidate: CandidateModel) {
  candidateToRemove.value = candidate
  isRemoveDialogShown.value = true
}

function getDateTime(candidate: CandidateModel) {
  if (!candidate.created) {
    return new Date().toLocaleString()
  }
  return `${new Date(candidate.created).toLocaleDateString()} ${new Date(candidate.created).toLocaleTimeString()}`
}

async function removeCandidate() {
  const candidate = candidateToRemove.value as CandidateModel
  await CandidateService.remove(candidate)
  candidates.value = candidates.value.filter((_candidate) => _candidate.id !== candidate.id)
  isRemoveDialogShown.value = false
  candidateToRemove.value = null
}
</script>

<style lang="scss" scoped>
.add-dialog {
  width: 300px;
}
</style>
