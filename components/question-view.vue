<template lang="pug">
v-list-item.question-view(
  link
)
  .py-2(
    :class="{ 'ml-4': nudge }"
  )
    v-list-item-title.question-view__title(
      :class="getColorClass()"
    ) {{ question.title }}
    v-list-item-subtitle.text-grey-darken-4(
      v-for="commentLine in splitToLines(question.comment)"
      :class="{ 'mt-1': commentLine }"
    ) {{ commentLine }}
</template>

<script setup lang="ts">
import QuestionModel from '~/models/question-model'

const props = defineProps({
  question: { type: QuestionModel, required: true },
  nudge: { type: Boolean, default: false },
})

function splitToLines (string: string) {
  return string.split('\n')
}

function getColorClass () {
  return props.question.getColorClass()
}
</script>

<style lang="stylus" scoped>
.question-view
  .question-view__title
    font-size 20px

  :deep(.v-list-item-title),
  :deep(.v-list-item-subtitle)
    word-wrap normal
    white-space normal
    display block

  @media (max-width: 768px)
    .question-view__title
      font-size 18px

  @media (max-width: 600px)
    .question-view__title
      font-size 16px
</style>
