<template lang="pug">
q-card.report
  q-card-section.pa-0
    .loader.row.flex-center.full-width(
      v-if="isLoading"
      style="padding: 150px 0"
    )
      q-spinner-cube(
        color="purple"
        size="5.5em"
      )
    #report(
      ref="report"
    )
    q-btn.upload-button(
      v-if="!isLoading"
      @click="downloadReport()"
      :icon="mdiUpload"
      color="primary"
      round
    )
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, useTemplateRef, nextTick,
  ref,
} from 'vue'
import { Stage } from 'konva/lib/Stage'
import { mdiUpload } from '@quasar/extras/mdi-v6'
import CandidateModel from '~/models/candidate-model'
import CandidateService from '~/services/candidates-service'
import BaseService from '~/services/base-service'
import { downloadURI } from '~/helpers/canvas'

const props = defineProps({
  candidate: { type: CandidateModel, required: true },
})

const questions = computed(() => props.candidate.questions.filter((question) => question.status))
const $scrollHelper = useTemplateRef<HTMLDivElement>('scrollHelper')
const $report = useTemplateRef<HTMLDivElement>('report')
const isLoading = ref(true)
let stage: Stage

async function downloadReport() {
  try {
    const downloadStage = await CandidateService.generateReport(document.createElement('div'), props.candidate, 900)
    const dataURL = downloadStage.toDataURL({ pixelRatio: window.devicePixelRatio || 2 })
    if (!dataURL) {
      throw new Error('No data URL')
    }
    downloadURI(dataURL, `${props.candidate.getFio()}.png`)
  } catch (error) {
    const message = (typeof error === 'string') ? error : (error as Error).message
    BaseService.handleError({ status: 500, message })
  }
}

async function generateReport() {
  try {
    stage = await CandidateService.generateReport($report.value, props.candidate)
    isLoading.value = false
  } catch (error) {
    const message = (typeof error === 'string') ? error : (error as Error).message
    BaseService.handleError({ status: 500, message })
  }
}

async function handleWindowResize() {
  try {
    if (!$report) {
      throw new Error('No report')
    }
    stage.remove()
    stage = await CandidateService.generateReport($report.value, props.candidate)
  } catch (error) {
    const message = (typeof error === 'string') ? error : (error as Error).message
    BaseService.handleError({ status: 500, message })
  }
}

window.addEventListener('resize', handleWindowResize)

onMounted(async () => {
  if ($report.value) {
    await generateReport()
    const $reportContainer = document.querySelector('.report') as HTMLDivElement
    if (($reportContainer?.scrollHeight || 0) > ($reportContainer?.offsetHeight || 0)) {
      handleWindowResize()
    }
  }
})
onUnmounted(() => window.removeEventListener('resize', handleWindowResize))
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  max-width: 900px;

  .upload-button {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
</style>
