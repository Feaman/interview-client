<template lang="pug">
v-list-item(
  link
)
  .py-2(
    :class="{ 'ml-4': nudge }"
  )
    v-list-item-title.text-h5(
      :class="getColorClass()"
    ) {{ question.title }}
    v-list-item-subtitle.text-grey-darken-4(
      v-for="commentLine in splitToLines(question.comment)"
      :class="{ 'mt-1': commentLine }"
    ) {{ commentLine }}
</template>

<script setup lang="ts">
import QuestionModel from '~~/models/question'

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
