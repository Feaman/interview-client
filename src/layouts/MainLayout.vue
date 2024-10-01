<template lang="pug">
.main-layout
  .global-loader.row.flex-center.full-width(
    v-if="isConfigLoading"
  )
    q-spinner-cube(
      color="purple"
      size="5.5em"
    )
  ErrorComponent.bg-white(v-else-if="globalError" :error="globalError")
  q-layout(
    v-else
  )
    q-header.row.flex-center.full-width(
      v-if="router.currentRoute.value.name !== ROUTE_IMAGE"
      elevated
    )
      q-toolbar.toolbar
        .font-size-24.cursor-pointer(
          @click="router.push({ name: ROUTE_INDEX })"
        ) Interviews
        .q-space
        q-btn(
          v-if="isShowReportButton"
          @click="isShowReport = true"
          color="purple"
        ) REPORT
        .q-space
        UserMenu
    q-page-container.row.flex-center.full-width(
      :class="{ 'px-4': !isMobile }"
    )
      router-view.page.py-4

q-dialog(
  backdrop-filter="blur(4px)"
  v-model="isShowReport"
)
  CandidateReport(
    :candidate="currentCandidate"
  )
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  globalError, isConfigLoading, currentCandidate, user, isMobile,
} from '~/composables'
import { ROUTE_SIGN, ROUTE_INDEX, ROUTE_IMAGE } from '~/router/routes'
import StorageService from '~/services/storage'
import UsersService from '~/services/users-service'

const router = useRouter()
const isShowReport = ref(false)
const isShowReportButton = computed(() => currentCandidate.value && currentCandidate.value.questions.filter((question) => question.status !== '').length)

watch(isConfigLoading, () => {
  if (globalError.value?.status === 401) {
    StorageService.set({ [UsersService.AUTH_TOKEN_NAME]: undefined })
    user.value = undefined
    globalError.value = undefined
    router.push({ name: ROUTE_SIGN })
  }
})
</script>

<style lang="scss" scoped>
.main-layout {
  .toolbar, .page {
    max-width: 900px;
    width: 100%;
  }
}
</style>
