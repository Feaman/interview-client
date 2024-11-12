<template lang="pug">
q-page
  q-breadcrumbs.bg-grey-4.py-2.pl-2(
    :bordered="!isMobile"
    :class="{ 'rounded-borders': !isMobile, 'borders-y': isMobile }"
     gutter="none"
  )
    template(
      v-slot:separator
    )
      q-icon(
        name="chevron_right"
        color="primary"
        size="1.5em"
      )
    q-breadcrumbs-el.text-bold.ml-1(
      :label="t('Candidates')"
      icon="home"
    )

  q-card.text-center.shadow-0.mt-4.py-8(
    v-if="!templates.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase {{ t('No one template found') }}
      .font-size-20.text-red.text-weight-bold.text-uppercase {{ t('This prevents you from adding candidates') }}
      q-btn.mt-8(
        @click="router.push({ name: ROUTE_NEW_TEMPLATE })"
        color="purple"
        :label="t('Add a template')"
      )

  .main-page.mt-4(
    v-if="candidates.length"
    :class="{ 'is-mobile': isMobile }"
  )
    q-input.bg-white(
      v-model="searchQuery"
      :placeholder="t('Search')"
      clearable
      outlined
      dense
    )
    q-card.column.flex-center.shadow-0.mt-4.py-8(
      v-if="searchQuery && !handledCandidates.length"
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
    )
      img(
        src="/images/no-data.jpg"
        style="width: 100px; height: 100px;"
      )
      q-card-section.pt-6
        .font-size-24.text-grey {{ t('Nothing found') }}
    q-list.rounded-borders.bg-white.mt-4(
      v-if="handledCandidates.length"
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
      separator
    )
      q-item.candidate(
        v-for="candidate in handledCandidates"
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
          q-item-label.font-size-16.text-grey-9(v-html="candidate.getFio(searchQuery)")
          q-item-label.font-size-14.text-grey(caption) {{ getDateTime(candidate) }}
          q-item-label.row
            div(
              v-for="(mainQuestion, index) in candidate.questions.filter((question) => question.status)"
              :style="`width: 5px; height: 5px; border-radius: 50%;`"
              :class="`bg-${mainQuestion.getColorClass()} ${index === 0 ? '' : 'ml-1'}`"
            )

        .report-button.pl-0(
          v-if="getIsShowReportButton(candidate)"
        )
          q-btn(
            @click.stop="showReport(candidate)"
            :icon="mdiFileDocument"
            color="grey-7"
            flat
            round
          )

        q-item-section.pl-0(
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

  q-card.text-center.shadow-0.mt-4.py-8(
    v-else-if="templates.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase {{ t('No one candidate found') }}
      q-btn.mt-8(
        @click="openDialog()"
        color="purple"
        :label="t('Add a candidate')"
      )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isDialogShown"
  )
    q-card.add-dialog(
      style="width: 100%; max-width: 500px;"
    )
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase {{ t('New candidate') }}
      q-separator
      q-card-section
        .text-h6 {{ t('First name') }}
        q-input(
          v-model="firstName"
          ref="firstNameElement"
          :hint="t('At least 3 letters')"
          :rules="[value => StringHelper.checkForLettersAndSpaces(value) || t('Only letters and spaces are allowed')]"
          outlined
          dense
        )
        .text-h6.mt-4 {{ t('Second name') }}
        q-input(
          v-model="secondName"
          :rules="[value => StringHelper.checkForLettersAndSpaces(value) || t('Only letters and spaces are allowed')]"
          outlined
          dense
        )
        .text-h6.mt-4 {{ t('Template') }}
        q-select(
          v-model="template"
          :options="templates"
          option-label="title"
          hint="required"
          outlined
          dense
        )
        .text-h6.mt-4 {{ t('Photo') }}
        q-file(
          @rejected="onPhotoRejected"
          v-model="photo"
          :max-file-size="MAX_FILE_SIZE"
          :hint="`${t('Max file size is')} ${MAX_FILE_SIZE / 1024 / 1024}${t('MB')}`"
          :error="!!photoErrorText"
          :error-message="photoErrorText"
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
          :label="t('Create')"
          color="primary"
          flat
        )
        q-space
        q-btn(
          :label="t('Close')"
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
        .text-h6.text-uppercase {{ t('Candidate deletion') }}
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
          :label="t('Delete')"
          color="red"
          flat
          v-close-popup
        )
        q-space
        q-btn(
          :label="t('Close')"
          flat
          v-close-popup
        )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isShowReport"
  )
    CandidateReport(
      :candidate="selectedCandidate"
    )
  </template>

<script setup lang="ts">
import { mdiClose, mdiFileDocument } from '@quasar/extras/mdi-v6'
import {
  computed, nextTick, onMounted, ref,
} from 'vue'
import { useRouter } from 'vue-router'
import { data } from 'autoprefixer'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import { ROUTE_CANDIDATE, ROUTE_NEW_TEMPLATE } from '~/router/routes'
import { t } from '~/services/translate'
import TemplateModel from '~/models/template-model'
import {
  candidates, isMobile,
  templates, isCandidateLoading,
} from '~/composables'
import StringHelper from '~/helpers/string'

defineOptions({
  name: 'IndexPage',
})

const notFountImage = new Image()
notFountImage.src = '/images/no-data.jpg'

const MAX_FILE_SIZE = 2097152
const ERROR_FILE_SIZE = 'max-file-size'
const ERROR_FILE_TYPE = 'accept'

const searchQuery = ref('')
const firstNameElement = ref(null)
const photoErrorText = ref('')
const isDialogShown = ref(false)
const firstName = ref('')
const secondName = ref('')
const template = ref<TemplateModel | undefined>(templates.value.find((_template) => _template.isDefault))
const photo = ref<File | undefined>(undefined)
const isRemoveDialogShown = ref(false)
const candidateToRemove = ref<CandidateModel | null>(null)
const handledCandidates = computed(() => {
  const candidatesToShow = candidates.value.sort((previousItem, nextItem) => Number(nextItem.id) - Number(previousItem.id))
  if (searchQuery.value) {
    const regExp = new RegExp(searchQuery.value.toLocaleLowerCase().replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), 'i')
    return candidatesToShow.filter((candidate) => regExp.test(candidate.getFio().toLocaleLowerCase()))
  }
  return candidatesToShow
})
const router = useRouter()
const isShowReport = ref(false)
const selectedCandidate = ref<CandidateModel | undefined>(undefined)
const isValid = computed(() => {
  const result = StringHelper.checkForLettersAndSpaces(firstName.value)
  && StringHelper.checkForLettersAndSpaces(secondName.value)
  && firstName.value.length >= 3
  && template.value
  return result
})

function openCandidate(candidate: CandidateModel) {
  router.push({ name: ROUTE_CANDIDATE, params: { id: String(candidate.id) } })
}

function showReport(candidate: CandidateModel) {
  selectedCandidate.value = candidate
  isShowReport.value = true
}

function getIsShowReportButton(candidate: CandidateModel) {
  return candidate && candidate.questions.filter((question) => question.status !== '').length
}

function onPhotoRejected(rejectedEntries: { failedPropValidation: string }[]) {
  const errorType = rejectedEntries[0].failedPropValidation
  if (errorType === ERROR_FILE_TYPE) {
    photoErrorText.value = t('File is not an image')
  } else if (errorType === ERROR_FILE_SIZE) {
    photoErrorText.value = `${t('Max file size is')} ${MAX_FILE_SIZE / 1024 / 1024}${t('MB')}`
  }
}

async function openDialog() {
  firstName.value = ''
  secondName.value = ''
  photo.value = undefined
  isDialogShown.value = true
  photoErrorText.value = ''
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

.candidate {
  position: relative;

  .report-button {
    position: absolute;
    right: 60px;
    top: calc((100% - 42px) / 2);
  }
}
</style>
