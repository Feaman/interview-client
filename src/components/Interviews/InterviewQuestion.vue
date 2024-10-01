<template lang="pug">
  q-item.question.pa-0
    q-item-section
      q-expansion-item.rounded-borders(
        :group="`${isSubQuestion ? 'sub-' : ''}question`"
      )
        template(
          v-slot:header
        )
          q-item-section.question__title(
            :class="`text-${question.getColorClass()} ${isMobile ? 'question__title--mobile font-size-14' : 'font-size-24 py-4'}`"
          ) {{ question.title }}
          q-item-section(
            side
          )
            .question__reactions.row.items-center(
              :class="{ 'question__reactions--mobile': isMobile }"
            )
              q-btn.pa-0(
                @click.stop="setStatus(question, STATUS_SUPER)"
                :icon="mdiEmoticonHappyOutline"
                color="green"
                round
                flat
              )
              q-btn.ml-2(
                @click.stop="setStatus(question, STATUS_NOT_GOOD)"
                :icon="mdiEmoticonNeutralOutline"
                :class="isMobile ? 'ml-2' : 'ml-2'"
                color="amber"
                round
                flat
              )
              q-btn.ml-2(
                @click.stop="setStatus(question, STATUS_BAD)"
                :icon="mdiEmoticonSadOutline"
                color="red"
                round
                flat
              )
        q-card.rounded-borders.pt-1
          q-card-section.px-0.pb-0(
            :class="{ 'pb-0': isMobile && !isSubQuestion }"
          )
            q-input.text-black.shadow-0.font-size-16.mb-4.mx-4(
              @update:modelValue="setComment(question, $event)"
              :modelValue="question.comment"
              label="Комментарий"
              type="textarea"
              standout="bg-grey-2"
              debounce="400"
              autogrow
            )

            q-list.question__task-links.column.mt-4(
              v-if="question.taskText || question.taskLinks.length"
              separator
            )
              q-item(
                v-if="question.taskText"
                :class="isMobile ? 'py-0 px-2' : 'py-2 px-2'"
              )
                q-item-section
                  .question__task-text.mt-4.text-center
                    .row.flex-center
                      .bg-grey-3.rounded-borders.pa-2 {{ question.taskText }}
                    q-btn.text-white.my-6(
                      @click="copyToClipboard(question.taskText)"
                      color="pink"
                    ) copy
              q-item.px-2(
                v-for="taskLink in question.taskLinks"
                :class="isMobile ? 'py-2' : 'py-4'"
              )
                q-item-section
                  .text-center
                    a.row.flex-center(
                      :href="taskLink.url"
                      :class="isMobile ? 'font-size-16' : 'font-size-24'"
                      target="_blank"
                    )
                      q-icon(
                        :name="mdiOpenInNew"
                      )
                      .ml-1 {{ taskLink.title }}
                    q-btn.my-2.mt-4.text-white(
                      @click="copyToClipboard(taskLink.url)"
                      color="pink"
                    ) copy
            q-list.rounded-borders.mx-4.mb-4.mt-6(
              v-if="question.items.length"
              bordered
              separator
            )
              InterviewQuestion(
                v-for="(subQuestion, index) in question.items"
                @update:comment="setComment"
                @update:status="setStatus"
                :key="index"
                :question="subQuestion"
                isSubQuestion
              )
</template>

<script setup lang="ts">
import copy from 'copy-to-clipboard'
import {
  mdiOpenInNew, mdiEmoticonHappyOutline, mdiEmoticonNeutralOutline, mdiEmoticonSadOutline,
} from '@quasar/extras/mdi-v6'
import QuestionModel from '~/models/question-model'
import { isMobile } from '~/composables'

const { STATUS_SUPER } = QuestionModel
const { STATUS_NOT_GOOD } = QuestionModel
const { STATUS_BAD } = QuestionModel

const emit = defineEmits<{
  'update:comment': [question: QuestionModel, comment: string],
  'update:status': [question: QuestionModel, status: string],
}>()

const props = defineProps({
  question: { type: QuestionModel, required: true },
  isSubQuestion: { type: Boolean, required: false },
})

function setComment(question: QuestionModel, comment: string) {
  emit('update:comment', question, comment)
}

function setStatus(question: QuestionModel, status: string) {
  if (status === question.status) {
    status = ''
  }
  emit('update:status', question, status)
}

function copyToClipboard(string: string) {
  copy(string)
}
</script>

<style lang="scss" scoped>
.question {
  :deep() {
    .q-field__native {
      color: rgba(0, 0, 0, 0.87);
      line-height: 22px;
    }
  }

  .q-expansion-item {
    border: 2px solid #ffffff;
    transition: margin 0.1s, border-color 0.3s;

    :deep() .q-item__section--side.relative-position {
      display: none;
    }
  }

  .q-expansion-item--expanded {
    border-color: #9f48c3;
    margin: 10px;
  }

  :deep() .q-expansion-item--expanded > div > .q-item {
    background-color: rgba(0, 0, 0, 0.05);

    .question__title {
      font-weight: bold;
    }
  }

  .question__reactions:deep() {
    .q-btn {
      min-width: 0;
      min-height: 0;
    }

    .q-icon {
      width: 34px;
      height: 34px;
    }
  }

  .question__reactions--mobile:deep() {
    .q-icon {
      width: 28px;
      height: 28px;
    }
  }

  .question__title {
    line-height: 28px;

    &.question__title--mobile {
      line-height: 18px;
    }
  }

  .question__task-links {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  .question__task-text, .question__task-links {
    :deep(.q-btn) {
      height: 30px;
      min-height: 10px;
    }
  }
}
</style>
