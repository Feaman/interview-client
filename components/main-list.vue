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
  v-card.my-8
    v-list#candidates.pa-0(lines="two")
      template(
        v-for="(candidate, index) in candidatesSorted"
        :key="candidate.id"
      )
        v-list-item.cursor-pointer.py-0(
          :title="candidate.name"
          :subtitle="candidate.created"
          @click="openCandidate(candidate)"
        )
          template(v-slot:append)
            .py-2
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
import { ref } from 'vue'
import type { Ref } from 'vue'
import questions from '~/data.json'
import CandidateService from '~/services/candidates-service'
import CandidateModel from '~/models/candidate-model'
import { candidates } from '~/compositions/candidates'

const isDialogShown = ref(false)
const name = ref('')
const isRemoveDialogShown = ref(false)
const candidateToRemove: Ref<CandidateModel | null> = ref(null)
const candidatesSorted = computed(() => candidates.value.sort((previousItem, nextItem) => Number(nextItem.id) - Number(previousItem.id)))

function openCandidate (candidate: CandidateModel) {
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
  const candidate = candidateToRemove.value as CandidateModel
  await CandidateService.remove(candidate)
  candidates.value = candidates.value.filter(_candidate => _candidate.id !== candidate.id)
  isRemoveDialogShown.value = false
  candidateToRemove.value = null
}
</script>

<style lang="stylus" scoped>
.create-card
  width 400px

.cursor-pointer
  cursor pointer

.v-list-item:hover
  background-color #f5f5f5
</style>
