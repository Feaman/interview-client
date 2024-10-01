<template lang="pug">
q-page
  q-card.text-center.shadow-0.py-8(
    v-if="!templates.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase No one template found
      .font-size-20.text-red.text-weight-bold.text-uppercase this prevents you from adding candidates
      q-btn.mt-8(
        @click="router.push({ name: ROUTE_NEW_TEMPLATE })"
        color="purple"
        label="Try to add one"
      )
  .main-page(
    v-if="candidates.length"
    :class="{ 'is-mobile': isMobile }"
  )
    q-list.rounded-borders.bg-white(
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
          q-item-label.font-size-14.text-grey(caption) {{ getDateTime(candidate) }}

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
      v-if="templates.length"
      position="bottom-right"
      :offset="[18, 18]"
    )
      q-btn(
        @click="openDialog()"
        color="accent"
        icon="add"
        fab
      )
  q-card.text-center.shadow-0.mt-6.py-8(
    v-else
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase No one candidate found
      q-btn.mt-8(
        @click="openDialog()"
        color="purple"
        label="Try to add one"
      )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isDialogShown"
  )
    q-card.add-dialog(
      style="width: 100%; max-width: 500px;"
    )
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase New candidate
      q-separator
      q-card-section
        .text-h6 First name
        q-input(
          v-model="firstName"
          ref="firstNameElement"
          hint="At least 3 letters"
          outlined
          dense
        )
        .text-h6.mt-4 Second name
        q-input(
          v-model="secondName"
          outlined
          dense
        )
        .text-h6.mt-4 Template
        q-select(
          v-model="template"
          :options="templates"
          option-label="title"
          outlined
          dense
        )
        .text-h6.mt-4 Photo
        q-file(
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
          :disabled="!isValid"
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
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase Delete candidate
      q-separator
      q-card-section
        q-list.rounded-borders(
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
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import { ROUTE_CANDIDATE, ROUTE_NEW_TEMPLATE } from '~/router/routes'
import TemplateModel from '~/models/template-model'
import {
  templates, candidates, isMobile, isCandidateLoading,
} from '~/composables'

defineOptions({
  name: 'IndexPage',
})

const MAX_FILE_SIZE = 2097152
const ERROR_FILE_SIZE = 'max-file-size'
const ERROR_FILE_TYPE = 'accept'

const firstNameElement = ref(null)
const photoErrorText = ref('')
const isDialogShown = ref(false)
const firstName = ref('')
const secondName = ref('')
const template = ref<TemplateModel | undefined>(templates.value.find((_template) => _template.isDefault))
const photo = ref<File | undefined>(undefined)
const isRemoveDialogShown = ref(false)
const candidateToRemove = ref<CandidateModel | null>(null)
const candidatesSorted = computed(() => candidates.value.sort((previousItem, nextItem) => Number(nextItem.id) - Number(previousItem.id)))
const router = useRouter()

const isValid = computed(() => firstName.value.length >= 3 && template.value)

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

async function openDialog() {
  firstName.value = ''
  secondName.value = ''
  photo.value = undefined
  isDialogShown.value = true
  setTimeout(() => {
    if (firstNameElement.value) {
      (firstNameElement.value as HTMLInputElement)?.focus()
    }
  })
}

async function add() {
  if (!template.value) {
    throw new Error('Template not selected')
  }

  const formData = new FormData()
  formData.append('firstName', firstName.value)
  formData.append('secondName', secondName.value)
  formData.append('data', template.value.data)
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
