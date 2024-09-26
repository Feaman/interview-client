<template lang="pug">
.candidate-page(
  :class="{ 'mobile': isMobile }"
)
  .candidate-container.mb-6
    q-card.pa-4.pl-6.mt-6.shadow-0(
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
    )
      .items-center(
        :class="isMobile ? 'column' : 'row'"
      )
        PersonAvatar(
          @update:photo="setPhoto"
          :photoPath="candidate.photoPath"
          :initials="candidate.getInitials()"
          isClickable
        )

        q-input.name-input(
          @update:modelValue="setName"
          :modelValue="candidate.name"
          :class="{ 'mt-4': isMobile, 'ml-4': !isMobile, 'ml-6': !isMobile && candidate.photoPath }"
          label="Имя"
          debounce="400"
        )

    q-list.rounded-borders.bg-white.mt-6(
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
      separator
    )
      QuestionComponent(
        v-for="(question, index) in candidate.questions"
        @update:comment="setComment"
        @update:status="setStatus"
        :key="index"
        :question="question"
      )
</template>

<script setup lang="ts">
import CandidateModel from '~/models/candidate-model'
import QuestionModel from '~/models/question-model'
import { isMobile } from '~/composables'

const emit = defineEmits<{
  'update:comment': [question: QuestionModel, comment: string]
  'update:name': [name: string]
  'update:photo': [file: File]
  'update:status': [question: QuestionModel, status: string]
}>()

const props = defineProps({
  candidate: { type: CandidateModel, required: true },
})

function setComment(question: QuestionModel, comment: string) {
  emit('update:comment', question, comment)
}

function setName(name: string) {
  emit('update:name', name)
}

function setStatus(question: QuestionModel, status: string) {
  emit('update:status', question, status)
}

function setPhoto(file: File) {
  emit('update:photo', file)
}
</script>

<style lang="scss" scoped>
.candidate-page {
  .name-input:deep() {
    .q-field__control {
      height: 84px;
    }

    input {
      font-size: 44px;
    }
  }

  &.mobile {
    .name-input:deep() {
      width: 100%;

      .q-field__control {
        height: 60px;
      }

      input {
        font-size: 18px;
      }
    }
  }
}
</style>
