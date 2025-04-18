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
      v-if="![ROUTE_IMAGE, ROUTE_FILE_PREVIEW].includes(router.currentRoute.value.name)"
      elevated
    )
      q-toolbar.toolbar
        .row.cursor-pointer(
          @click="goToHome()"
        )
          img(src="/icons/icon.png" style="width: 35px; height: 35px;")
          .font-size-24.ml-1 {{ t('Interviews') }}
        .q-space
        q-select.language-select(
          v-model="currentLanguage"
          :options="LANGUAGES"
          outlined
          dense
        )
        .ml-4
          UserMenu
    q-page-container.row.flex-center.full-width(
      :class="{ 'px-4': !isMobile }"
    )
      router-view.page.py-4
</template>

<script setup lang="ts">
import {
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { t } from '~/services/translate'
import {
  globalError, isConfigLoading, currentCandidate, user, isMobile,
  currentLanguage,
  LANGUAGES,
} from '~/composables'
import {
  ROUTE_SIGN,
  ROUTE_INDEX,
  ROUTE_IMAGE,
  ROUTE_FILE_PREVIEW,
} from '~/router/routes'
import StorageService from '~/services/storage'
import UsersService from '~/services/users-service'

const router = useRouter()

function goToHome() {
  window.location.href = '/'
}

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

  .language-select {

    :deep() {
      .q-icon, span {
        color: #ffffff;
      }

      .q-field__control, .q-field__native, .q-field__append {
        height: 30px;
        min-height: 0;
        padding-right: 2px;
      }

      .q-field__control:not(:hover):before {
        border-color: rgba(255, 255, 255, 0.3);
      }

      .q-field__control:hover:before {
        border-color: #ffffff;
      }

      .q-field__control:hover:after {
        border-color: transparent;
      }
    }
  }
}
</style>
