<template lang="pug">
q-page.full-width.row.flex-center
  .global-loader.row.flex-center.full-width(
    v-if="!isImageLoaded && !isError"
  )
    q-spinner-cube(
      color="purple"
      size="5.5em"
    )
  q-card.shadow-0(
    v-if="isError"
    bordered
  )
    q-card-section.text-center
      .text-uppercase File not found
      q-icon.mt-2(
        :name="mdiEmoticonSadOutline"
        size="xl"
        color="red"
      )
  q-card.shadow-0.mx-6(
    v-show="!isError && isImageLoaded"
    bordered
  )
    q-card-section.text-center
      img.full-width(
        v-if="isImage"
        @load="isImageLoaded = true"
        @error="isError = true"
        :src="path"
      )
      div(
        v-else
      ) {{ t('File') }}
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { mdiEmoticonSadOutline } from '@quasar/extras/mdi-v6'
import { files, isMobile } from '~/composables'
import BaseService, { type TGlobalError } from '~/services/base-service'
import { t } from '~/services/translate'
import FileModel, { type TFile } from '~/models/file-model'

defineOptions({
  name: 'FilePage',
})

const router = useRouter()
const isError = ref(false)
const isImageLoaded = ref(false)

const path = router.currentRoute.value.query.path as string
const mimeType = router.currentRoute.value.query['mime-type'] as string
const isImage = !!mimeType.startsWith('image/')

if (!path || !mimeType) {
  BaseService.handleError({ status: 404, message: 'File not found' })
} else if (!isImage) {
  isImageLoaded.value = true
  window.location.href = path
}
</script>

<style lang="scss" scoped>
.q-card {
  max-width: 100%;
}
</style>
