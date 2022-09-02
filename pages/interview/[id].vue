<template lang="pug">
div
  v-progress-circular(
    v-if="isLoading"
    indeterminate
  )
  main-interview(
    v-else
    @update:title="setTitle"
    @update:comment="setComment"
    @update:status="setStatus"
    :interview="interview"
  )
</template>

<script setup lang="ts">
import QuestionModel from '~~/models/question'
import InterviewService from '~~/services/interview'

const route = useRoute()
const isLoading = ref(true)
const interview = ref(null)

async function getInterview () {
  const list = await InterviewService.getList()
  interview.value = list.find(interview => interview.id === route.params.id)
  isLoading.value = false
}
getInterview()

function setTitle (title) {
  interview.value.title = title
  InterviewService.save(interview.value)
}

function setComment (question: QuestionModel, comment: string) {
  question.comment = comment
  InterviewService.save(interview.value)
}

function setStatus (question: QuestionModel, status: string) {
  question.status = status
  InterviewService.save(interview.value)
}
</script>
