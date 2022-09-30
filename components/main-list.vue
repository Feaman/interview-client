<template lang="pug">
div
  .d-flex.flex-center
    .text-h3 Candidates
    v-spacer
    v-btn.ml-6(
      @click="openDialog"
      color="pink"
      class="text-white"
    ) Add
  v-card.mt-8
    v-list.pa-0
      template(
        v-for="(candidate, index) in candidates"
      )
        v-list-item(
          @click="openCandidate(candidate)"
        )
          v-list-item-title
            .d-flex.align-center
              div {{ candidate.name }}
              v-spacer
              v-btn(
                @click.stop="openRemoveDialog(candidate)"
                :icon="mdiClose"
                variant="text"
              )
        v-divider(
          v-if="index < candidates.length - 1"
          :key="index"
        )

  v-dialog(
    v-model="isDialogShown"
    width="400"
  )
    v-card.create-card.pb-2
      v-card-text
        .text-h5 New candidate
        v-text-field.mt-4(
          label="Name"
          v-model="name"
        )
        v-btn(
          @click="add"
          :disabled="name.length < 4"
          color="blue"
        )
          .text-white Create

  v-dialog(
    v-model="isRemoveDialogShown"
    width="400"
  )
    v-card.create-card.pb-2(
      v-if="candidateToRemove"
    )
      v-card-text
        .text-h5.mb-4
          span Are you sure about
          strong.px-2 {{ candidateToRemove.name }}
          span deletion?
        v-btn(
          @click="removeCandidate"
          color="red"
        )
          .text-white Delete
        v-btn.ml-4(
          @click="isRemoveDialogShown = false"
          color="blue"
        )
          .text-white Close
</template>

<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import questions from '~/data.json'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import { user } from '@/compositions/users'
import { candidates } from '~/compositions/candidates'

const isDialogShown = ref(false)
const name = ref('')
const isRemoveDialogShown = ref(false)
const candidateToRemove = ref(null)

function openCandidate (candidate) {
  useRouter().push({ name: 'candidate-id', params: { id: String(candidate.id) } })
}

function openDialog () {
  name.value = ''
  isDialogShown.value = true
}

async function add () {
  const candidate = await CandidateService.create(name.value, JSON.stringify(questions))
  candidates.value.push(candidate)
  isDialogShown.value = false
}

function openRemoveDialog (candidate: CandidateModel) {
  candidateToRemove.value = candidate
  isRemoveDialogShown.value = true
}

async function removeCandidate () {
  await CandidateService.remove(candidateToRemove.value)
  candidates.value = candidates.value.filter(_candidate => _candidate.id !== candidateToRemove.value.id)
  isRemoveDialogShown.value = false
  candidateToRemove.value = null
}
</script>

<style lang="stylus" scoped>
.create-card
  width 400px
</style>
