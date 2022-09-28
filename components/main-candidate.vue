<template lang="pug">
.candidate.fill-height.d-flex.flex-column
  .candidate__header
    .d-flex.align-center
      v-btn(@click="$router.push('/')" color="blue" class="text-white") List
      v-switch.ml-8(
        v-model="isViewMode"
        label="Режим просмотра"
        color="blue"
        hide-details
        inset
      )
      v-progress-circular(
        v-if="isCandidateLoading"
        color="purple"
        :size="20"
        indeterminate
      )
      main-user
    .mt-4
      .text-h3(
        v-if="isViewMode"
      ) {{ candidate.name }}
      v-text-field(
        v-else
        @update:modelValue="setName"
        :modelValue="candidate.name"
        label="Имя"
      )
      v-spacer
  .candidate__content.elevation-2.rounded-lg.mt-4
    div(
      v-if="isViewMode"
    )
      template(
        v-for="(question, index) in candidate.questions"
      )
        v-list.pa-0
          question-view(
            :question="question"
          )
          v-divider(
            v-if="index < candidate.questions.length - 1"
            :key="index"
          )
        v-list.pa-0(
          v-if="question.items"
        )
          template(
            v-for="(subQuestion, subIndex) in question.items"
          )
            question-view(
              :question="subQuestion"
              :nudge="true"
            )
            v-divider(
              v-if="index < question.items.length - 1"
              :key="subIndex"
            )
    .elevation-2(
      v-else
    )
      v-expansion-panels
        v-expansion-panels
          question-edit(
            v-for="question in candidate.questions"
            @update:comment="setComment"
            @update:status="setStatus"
            :question="question "
          )
</template>

<script setup lang="ts">
import CandidateModel from '~~/models/candidate-model'
import QuestionModel from '~~/models/question-model'
import { isCandidateLoading } from '~~/compositions/loaders'

const emit = defineEmits<
  {(eventName: 'update:comment', question: QuestionModel, comment: string): void
  (eventName: 'update:name', name: string): void
  (eventName: 'update:status', question: QuestionModel, status: string): void }>()

const props = defineProps({
  candidate: { type: CandidateModel, required: true },
})
const isViewMode = ref(false)

function setComment (question: QuestionModel, comment: string) {
  emit('update:comment', question, comment)
}

function setName (name: string) {
  emit('update:name', name)
}

function setStatus (question: QuestionModel, status: string) {
  emit('update:status', question, status)
}
</script>

<style scoped lang="stylus">
.candidate
  .candidate__content
    overflow auto
  .v-text-field :deep(input)
    font-size 44px
</style>
