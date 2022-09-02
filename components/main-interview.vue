<template lang="pug">
div
  .d-flex.align-center
    v-btn(@click="$router.push('/')" color="blue" class="text-white") List
    v-switch.ml-8(
      v-model="isViewMode"
      label="Режим просмотра"
      color="blue"
      hide-details
      inset
    )
  .mt-4
    .text-h3(
      v-if="isViewMode"
    ) {{ interview.title }}
    v-text-field(
      v-else
      @update:modelValue="setTitle"
      :modelValue="interview.title"
      label="Имя"
    )
    v-spacer
  .mt-4(
    v-if="isViewMode"
  )
    template(
      v-for="(question, index) in interview.questions"
    )
      v-list.pa-0(
        v-if="isViewMode"
      )
        question-view(
          :question="question"
        )
        v-divider(
          v-if="index < interview.questions.length - 1"
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
  v-expansion-panels(
    v-else
  )
    v-expansion-panels
      question-edit(
        v-for="question in interview.questions"
        @update:comment="setComment"
        @update:status="setStatus"
        :question="question "
      )
</template>

<script setup lang="ts">
import InterviewModel from '~~/models/interview'
import QuestionModel from '~~/models/question'

const emit = defineEmits<
  {(name: 'update:comment', question: QuestionModel, comment: string): void
  (name: 'update:title', title: string): void
  (name: 'update:status', question: QuestionModel, status: string): void }>()
const props = defineProps({
  interview: { type: InterviewModel, required: true },
})
const isViewMode = ref(false)

function setComment (question: QuestionModel, comment: string) {
  emit('update:comment', question, comment)
}

function setTitle (title: string) {
  emit('update:title', title)
}

function setStatus (question: QuestionModel, status: string) {
  emit('update:status', question, status)
}
</script>

<style scoped lang="stylus">
.v-text-field :deep(input)
  font-size 44px
</style>
