<template lang="pug">
.main-layout
  #test(style="height: 1px; position: absolute; overflow: hidden;")
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
        .row(
          @click="goToHome()"
        )
          img(src="/icons/icon.png" style="width: 35px; height: 35px;")
          .font-size-24.cursor-pointer.ml-1 {{ t('Interviews') }}
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
  computed, onMounted, ref, watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { t } from '~/services/translate'
import {
  globalError, isConfigLoading, currentCandidate, user, isMobile,
  currentLanguage,
  LANGUAGES,
} from '~/composables'
import { ROUTE_SIGN, ROUTE_INDEX, ROUTE_IMAGE } from '~/router/routes'
import StorageService from '~/services/storage'
import UsersService from '~/services/users-service'
import { getFontLoader } from '~/helpers/canvas'
import CandidateModel from '~/models/candidate-model'
import CandidateService from '~/services/candidates-service'

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

onMounted(() => {
  // Load fonts
  const fontLoaderFunction = getFontLoader()
  fontLoaderFunction(() => {
    setTimeout(() => {
      const candidate = new CandidateModel({
        id: 0,
        firstName: 'Юлия',
        secondName: 'Володина',
        photoPath: '',
        // eslint-disable-next-line max-len
        data: '[{"title":"Архитектура","comment":"","items":[{"title":"SOLID, паттерны [Singleton, Decorator, Fabric]","comment":"Незнание паттерна Singleton.","items":[],"status":"STATUS_NOT_GOOD","taskLinks":[],"taskText":""}],"status":"STATUS_NOT_GOOD","taskLinks":[],"taskText":""},{"title":"JavaScript","comment":"","items":[{"title":"Теория","comment":"","items":[],"status":"STATUS_SUPER","taskLinks":[],"taskText":""}]}]',
        created: '2021-12-01',
      })
      CandidateService.generateReport(document.querySelector('#test') as HTMLDivElement, candidate)
    })
  })
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
