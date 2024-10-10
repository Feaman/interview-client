<template lang="pug">
  q-card.candidate-report(style="width: 900px; max-width: 900px;")
    q-card-section.column.items-center
      .candidate-report__candidate.column.items-center.rounded-borders.pa-4.pt-1
        PersonAvatar(
          :photoPath="candidate.photoPath"
          :initials="candidate.getInitials()"
        )
        .text-subtitle1.text-weight-bold.font-size-24.mt-2 {{ candidate.getFio() }}

      .row.flex-center
        q-avatar.bg-green(size="18px")
        .ml-1 Хорошо
        q-avatar.bg-orange.ml-6(size="18px")
        .ml-1 Средне
        q-avatar.bg-red.ml-6(size="18px")
        .ml-1 Плохо

      .candidate-report__question.rounded-borders.full-width.mt-4(
        v-for="question in questions"
        bordered
        separator
      )
        .candidate-report__question-title.text-center.py-2.bg-grey-2
          .row.items-center.justify-center
            .text-uppercase.font-size-21.text-weight-bolder(
              :class="`text-${question.getColorClass()}`"
            ) {{ question.title }}
          .font-size-14.text-grey-7.line-height-16.mt-1(
            v-if="question.comment"
            caption
          ) {{ question.comment }}

        q-separator

        q-list(
          separator
        )
          q-item.py-2.px-0(
            v-for="subQuestion in getSubQuestions(question)"
          )
            q-item-section.ml-4
              q-item-label.font-size-18(
                :class="`text-${subQuestion.getColorClass()}`"
              ) {{ subQuestion.title }}
              q-item-label.font-size-14.mt-0(
                v-if="subQuestion.comment"
                caption
              ) {{ subQuestion.comment }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mdiThumbUp } from '@quasar/extras/mdi-v6'
import CandidateModel from '~/models/candidate-model'
import QuestionModel from '~/models/question-model'

const props = defineProps({
  candidate: { type: CandidateModel, required: true },
})

const questions = computed(() => props.candidate.questions.filter((question) => question.status))
const { STATUS_SUPER } = QuestionModel
const { STATUS_NOT_GOOD } = QuestionModel
const { STATUS_BAD } = QuestionModel

function getSubQuestions(question: QuestionModel) {
  return question.items.filter((subQuestion) => subQuestion.status)
}
</script>

<style lang="scss" scoped>
.candidate-report {
  .candidate-report__question, .candidate-report__avatar {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .candidate-report__question-title {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .q-item {
    min-height: 0;
  }
}
</style>
