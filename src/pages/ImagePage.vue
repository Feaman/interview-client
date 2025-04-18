<template lang="pug">
q-page.full-width.row.flex-center
  .global-loader.row.flex-center.full-width(
    v-if="!isLoaded && !isError"
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
      .text-uppercase Image not found
      q-icon.mt-2(
        :name="mdiEmoticonSadOutline"
        size="xl"
        color="red"
      )
  q-card.shadow-0.mx-6(
    v-show="!isError && isLoaded"
    bordered
  )
    q-card-section.text-center
      img.full-width(
        @load="isLoaded = true"
        @error="isError = true"
        :src="`/images/interview/${imageName}.jpg`"
      )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiEmoticonSadOutline } from '@quasar/extras/mdi-v6'
import { isMobile } from '~/composables'

defineOptions({
  name: 'ImagePage',
})

const router = useRouter()
const isError = ref(false)
const isLoaded = ref(false)
const { imageName } = router.currentRoute.value.params
</script>

<style lang="scss" scoped>
.q-card {
  max-width: 100%;
}
</style>
