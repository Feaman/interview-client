<template lang="pug">
  q-page
    CandidateComponent(
      v-if="candidate"
      @update:name="setName"
      @update:photo="setPhoto"
      @update:comment="setComment"
      @update:status="setStatus"
      :candidate="candidate"
    )
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { ref } from 'vue'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import QuestionModel from '~/models/question-model'
import { candidates, currentCandidate } from '~/composables'

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

function setName(name: string) {
  if (candidate.value) {
    candidate.value.name = name
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
    formData.append('name', candidate.value.name)
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
