<template lang="pug">
v-expansion-panel.question-edit
  v-expansion-panel-title.d-flex
    .question-edit__title(
      :class="question.getColorClass()"
    ) {{ question.title }}
    v-spacer
    v-btn(
      @click.stop="setStatusText(STATUS_SUPER)"
      :icon="mdiEmoticonHappyOutline"
      color="green"
      size="x-small"
    )
    v-btn.ml-2(
      @click.stop="setStatusText(STATUS_NOT_GOOD)"
      :icon="mdiEmoticonNeutralOutline"
      color="orange"
      size="x-small"
    )
    v-btn.ml-2.mr-4(
      @click.stop="setStatusText(STATUS_BAD)"
      :icon="mdiEmoticonSadOutline"
      color="red"
      size="x-small"
    )
  v-expansion-panel-text
    template(v-if="question.taskLinks?.length")
      .d-flex.align-center.mt-4(
        v-if="question.taskText"
      )
        .bg-grey-lighten-3.rounded.px-2.py-1 {{ question.taskText }}
        v-btn.text-white.ml-4(
          @click="copyToClipboard(question.taskText)"
          size="small"
          color="pink"
        ) copy
      .d-flex.align-center.mt-2(v-for="taskLink in question.taskLinks")
        NuxtLink.font-size-24.ml-1(
          :to="taskLink.url"
          target="_blank"
        )
          .d-flex.align-center
            v-icon(
              :icon="mdiOpenInNew"
              size="x-small"
            )
            .ml-1 {{ taskLink.title }}
        v-btn.ml-4.text-white(
          @click="copyToClipboard(taskLink.url)"
          size="small"
          color="pink"
        ) copy
    v-textarea.mt-4.mb-2(
      @update:modelValue="setCommentText"
      :modelValue="question.comment"
      hide-details
      label="Комментарий"
      rows="2"
    )
    v-expansion-panels.mt-6.mb-2(
      v-if="question.items && question.items.length"
    )
      question-edit(
        v-for="subQuestion in question.items"
        @update:comment="setComment"
        @update:status="setStatus"
        :question="subQuestion "
      )
</template>

<script setup lang="ts">
import copy from 'copy-to-clipboard'
import { mdiCloudUpload, mdiOpenInNew, mdiEmoticonHappyOutline, mdiEmoticonNeutralOutline, mdiEmoticonSadOutline } from '@mdi/js'
import QuestionModel from '~/models/question-model'

const STATUS_SUPER = QuestionModel.STATUS_SUPER
const STATUS_NOT_GOOD = QuestionModel.STATUS_NOT_GOOD
const STATUS_BAD = QuestionModel.STATUS_BAD

const emit = defineEmits<
{(name: 'update:comment', question: QuestionModel, comment: string): void
  (name: 'update:status', question: QuestionModel, status: string): void
}>()

const props = defineProps({
  question: { type: QuestionModel, required: true }
})

function setComment (question: QuestionModel, comment: string) {
  emit('update:comment', question, comment)
}

function setCommentText (comment: string) {
  setComment(props.question, comment)
}

function setStatus (question: QuestionModel, status: string) {
  emit('update:status', question, status)
}

function setStatusText (status: string) {
  setStatus(props.question, status)
}

function copyToClipboard (string: string) {
  copy(string)
}
</script>

<style lang="stylus" scoped>
.question-edit
  .v-btn :deep(.v-icon)
    min-width 24px
    min-height 24px

  .question-edit__title
    font-size 24px

  @media (max-width: 768px)
    .question-edit__title
      font-size 20px

  @media (max-width: 600px)
    .question-edit__title, :deep(.v-field__input)
      font-size 14px

    :deep(.v-field__input)
      line-height 16px

</style>
