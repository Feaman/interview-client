<template lang="pug">
q-page.candidate-page.mt-4(
  :class="{ 'mobile': isMobile }"
)
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
    q-breadcrumbs-el.ml-1(
      :to="{ name: ROUTE_INDEX }"
      label="Candidates"
      icon="home"
    )
    q-breadcrumbs-el(
      :label="candidate.getFio()"
      icon="person"
    )

  .candidate-container.mb-6
    q-card.pa-4.pl-6.mt-4.shadow-0(
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
    )
      .column.items-center(
        :class="isMobile ? 'column' : 'row'"
      )
        PersonAvatar(
          @update:photo="setPhoto"
          :photoPath="candidate.photoPath"
          :initials="candidate.getInitials()"
          :size="isMobile ? '72px' : '150px'"
          isClickable
        )

        q-input.name-input.mt-6(
          @update:modelValue="setFirstName"
          :modelValue="candidate.firstName"
          :class="{ 'mt-4': isMobile, 'ml-4': !isMobile, 'ml-6': !isMobile && candidate.photoPath }"
          debounce="400"
        )

        q-input.name-input.mt-6(
          @update:modelValue="setSecondName"
          :modelValue="candidate.secondName"
          :class="{ 'mt-4': isMobile, 'ml-4': !isMobile, 'ml-6': !isMobile && candidate.photoPath }"
          debounce="400"
        )

    q-list.rounded-borders.bg-white.mt-6(
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
      separator
    )
      InterviewQuestion(
        v-for="(question, index) in candidate.questions"
        @update:comment="setComment"
        @update:status="setStatus"
        :key="index"
        :question="question"
      )
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { ref } from 'vue'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import QuestionModel from '~/models/question-model'
import { candidates, currentCandidate, isMobile } from '~/composables'
import { ROUTE_INDEX } from '~/router/routes'

defineOptions({
  name: 'CandidatePage',
})

const route = useRoute()
const candidate = ref<CandidateModel | undefined>(undefined)

function getCandidate() {
  const candidateId = Number(route.params.id)
  candidate.value = candidates.value.find((_candidate) => _candidate.id === candidateId)
  if (!candidate.value) {
    throw new Error('Candidate not found')
  }
  currentCandidate.value = candidate.value
}
getCandidate()

function setFirstName(firstName: string) {
  if (candidate.value) {
    candidate.value.firstName = firstName
    CandidateService.update(candidate.value)
  }
}

function setSecondName(secondName: string) {
  if (candidate.value) {
    candidate.value.secondName = secondName
    CandidateService.update(candidate.value)
  }
}

function setComment(question: QuestionModel, comment: string) {
  if (candidate.value) {
    question.comment = comment
    CandidateService.update(candidate.value)
  }
}

function setStatus(question: QuestionModel, status: string) {
  if (candidate.value) {
    question.status = status
    CandidateService.update(candidate.value)
  }
}

async function setPhoto(file: File) {
  if (candidate.value) {
    const formData = new FormData()
    formData.append('id', String(candidate.value.id))
    formData.append('firstName', candidate.value.firstName)
    formData.append('secondName', candidate.value.secondName)
    formData.append('data', JSON.stringify(candidate.value.questions))
    if (file) {
      formData.append('photo', file)
    }
    const candidateData = await CandidateService.update(formData)
    candidate.value.photoPath = candidateData.photoPath
  }
}

onBeforeRouteLeave(() => {
  currentCandidate.value = undefined
})
</script>

<style lang="scss" scoped>
.candidate-page {
  .name-input:deep() {
    .q-field__control {
      height: 54px;
    }

    input {
      text-align: center;
      font-size: 44px;
    }
  }

  &.mobile {
    .name-input:deep() {
      width: 100%;

      .q-field__control {
        height: 34px;
      }

      input {
        font-size: 30px;
      }
    }
  }
}
</style>
