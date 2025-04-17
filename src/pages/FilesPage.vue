<template lang="pug">
q-page.files-page
  q-breadcrumbs.bg-grey-4.py-2.pl-2(
    :bordered="!isMobile"
    :class="{ 'rounded-borders': !isMobile, 'borders-y': isMobile }"
     gutter="none"
  )
    template(
      v-slot:separator
    )
      q-icon(
        name="chevron_right"
        color="primary"
        size="1.5em"
      )
    q-breadcrumbs-el.text-bold(
      :to="{ name: ROUTE_FILES }"
      :label="t('Files')"
      icon="widgets"
    )

  q-card.text-center.shadow-0.mt-6.py-8(
    v-if="!files.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase {{ t('No one file found') }}
      q-btn.mt-8(
        @click="router.push({ name: ROUTE_NEW_file })"
        color="purple"
        :label="t('Add a file')"
      )
  q-list.rounded-borders.bg-white.my-4(
    v-else
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
    separator
  )
    q-item(
      v-for="file in files"
      clickable
      v-ripple
    )
      q-item-section.pa-1
        q-item-label.row.font-size-16.text-grey-9 {{ file.name }}
        q-item-label.font-size-14(caption) {{ file.size }} {{ t('main questions') }}
      q-item-section
        .row
          q-space
          q-badge.font-size-14.py-1(
            v-if="file.isDefault"
            color="purple-5"
          ) {{ t('default') }}
      q-item-section(
        side
      )
        q-btn(
          @click.stop="openRemoveDialog(file)"
          :icon="mdiClose"
          flat
          round
        )

  q-page-sticky(
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      @click="router.push({ name: ROUTE_NEW_file })"
      color="accent"
      icon="add"
      fab
    )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isRemoveDialogShown"
  )
    q-card
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase {{ t('File deletion') }}
      q-separator
      q-card-section.pb-2
        q-list.rounded-borders(
          bordered
        )
          q-item.px-3
            q-item-section.pa-1
              q-item-label.font-size-16.text-grey-9 {{ fileToRemove.title }}
              q-item-label.font-size-14(caption) {{ fileToRemove.questions.length }} {{ t('main questions') }}
            q-item-section(side)
              q-badge.font-size-14.py-1(
                v-if="fileToRemove.isDefault"
                color="purple-5"
              ) {{ t('default') }}
      q-card-actions(
        align="left"
      )
        q-btn(
          @click="removeFile()"
          :loading="isFileLoading"
          :label="t('Delete')"
          color="red"
          flat
          v-close-popup
        )
        q-space
        q-btn(
          :label="t('Close')"
          flat
          v-close-popup
        )
</template>

<script setup lang="ts">
import { mdiClose } from '@quasar/extras/mdi-v6'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { files, isMobile, isFileLoading } from '~/composables'
import FileModel from '~/models/file-model'
import FileService from '~/services/files-service'
import { t } from '~/services/translate'

defineOptions({
  name: 'FilesPage',
})

const router = useRouter()
const isRemoveDialogShown = ref(false)
const fileToRemove = ref <FileModel | undefined>(undefined)

function openRemoveDialog(file: FileModel) {
  fileToRemove.value = file
  isRemoveDialogShown.value = true
}

async function removeFile() {
  const file = fileToRemove.value as FileModel
  await FileService.remove(file)
  files.value = files.value.filter((_file) => _file.id !== file.id)
  isRemoveDialogShown.value = false
  fileToRemove.value = undefined
}
</script>
