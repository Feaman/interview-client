<template lang="pug">
div
  .d-flex
    .text-h3 Interviews
    v-spacer
    v-btn(@click="isDialogShown=true") Add
  v-list.mt-8
    template(
      v-for="(interview, index) in list"
    )
      v-list-item(
        @click="openInterview(interview)"
      )
        v-list-item-title
          .d-flex.align-center
            div {{ interview.title }}
            v-spacer
            v-btn(
              @click.stop="remove(interview)"
              :icon="mdiClose"
              variant="text"
            )
      v-divider(
        v-if="index < list.length - 1"
        :key="index"
      )

  v-dialog(
    v-model="isDialogShown"
    width="400"
  )
    v-card.create-card.pb-2
      v-card-text
        .text-h5 New interview
        v-text-field.mt-4(
          label="Title"
          v-model="title"
        )
        v-btn(
          @click="add"
          :disabled="!title"
          color="blue"
        )
          .text-white Create
</template>

<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import BaseService from '~/services/base'
import questions from '~/data.json'
import InterviewService from '~~/services/interview'
import InterviewModel from '~~/models/interview'

const list = ref([])
const isDialogShown = ref(false)
const title = ref('')

async function getList () {
  list.value = (await BaseService.storage.get('list')) || []
}
getList()

function openInterview (interview) {
  useRouter().push({ name: 'interview-id', params: { id: interview.id } })
}

async function add () {
  const interview = new InterviewModel({
    id: `_${Math.random().toString(36).substr(2, 9)}_${new Date().getMilliseconds()}`,
    title: title.value,
    questions,
    date: new Date()
  })
  list.value.push(interview)
  await InterviewService.add(interview)
  isDialogShown.value = false
}

function remove (interview: InterviewModel) {
  console.log(interview)
}
</script>

<style lang="stylus">
.create-card
  width 400px
</style>
