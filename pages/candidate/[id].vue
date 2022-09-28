<template lang="pug">
div
  main-candidate(
    @update:name="setName"
    @update:comment="setComment"
    @update:status="setStatus"
    :candidate="candidate"
  )
</template>

<script setup lang="ts">
import QuestionModel from '~/models/question-model'
import CandidateService from '~/services/candidates-service'
import { candidates } from '~/compositions/candidates'

const route = useRoute()
const candidate = ref(null)

function getCandidate () {
  const candidateId = Number(route.params.id)
  candidate.value = candidates.value.find(candidate => candidate.id === candidateId)
  if (!candidate.value) {
    throw createError({ message: 'Candidate not found', fatal: true })
  }
}
getCandidate()

function setName (name) {
  candidate.value.name = name
  CandidateService.update(candidate.value)
}

function setComment (question: QuestionModel, comment: string) {
  question.comment = comment
  CandidateService.update(candidate.value)
}

function setStatus (question: QuestionModel, status: string) {
  question.status = status
  CandidateService.update(candidate.value)
}
</script>
