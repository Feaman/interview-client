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
      :label="t('Files')"
      icon="description"
    )

  q-card.text-center.shadow-0.mt-6.py-8(
    v-if="!files.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase {{ t('No one file found') }}
      q-btn.mt-8(
        @click="openFormDialog()"
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
      @click="openFormDialog(file)"
      clickable
      v-ripple
    )
      q-item-section.pa-1
        q-item-label.row.font-size-16.text-grey-9 {{ file.name }}
        q-item-label.font-size-14(caption) {{ file.originalName }}
        q-item-label.font-size-14(caption)
          FileSize(:file="file")
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
      @click="openFormDialog()"
      color="accent"
      icon="add"
      fab
    )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isAddDialogShown"
  )
    q-card
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase {{ t(currentFile.id ? 'File changing' : 'File adding') }}
      q-separator
      q-card-section.pb-2
        .file-data(v-if="currentFile.id")
          .text-grey-8
            .ellipsis.text-weight-bold.font-size-18.line-height-20.mt-2 {{ currentFile.originalName }}
            .mt-1 {{ currentFile.mimeType }}
            FileSize(:file="currentFile")
            div {{ currentFile.path }}
        q-input(
          :label="t('Name')"
          :class="{ 'mt-4': currentFile.id }"
          v-model="currentFile.name"
        )
        q-file.mt-6(
          v-model="fileObject"
          :label="t('File')"
        )
          template(v-slot:prepend)
            q-icon(name="attach_file")
      q-card-actions(
        align="left"
      )
        q-btn(
          :label="t('Close')"
          color="grey"
          flat
          v-close-popup
        )
        q-space
        q-btn(
          @click="handleFile(currentFile)"
          :loading="isFileLoading"
          :disabled="!checkFile(currentFile)"
          :label="t(currentFile.id ? 'Change' : 'Add')"
          flat
          v-close-popup
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
              q-item-label.row.font-size-16.text-grey-9 {{ fileToRemove.name }}
              q-item-label.font-size-14(caption) {{ fileToRemove.originalName }}
              q-item-label.font-size-14(caption)
                FileSize(:file="fileToRemove")
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
const isAddDialogShown = ref(false)
const fileToRemove = ref <FileModel | undefined>(undefined)
const currentFile = ref<FileModel | undefined>(undefined)
const fileObject = ref<File | undefined>(undefined)

function checkFile(file: FileModel) {
  return file.name && ((!file.id && fileObject.value) || file.id)
}

// Add / Change
function openFormDialog(file: FileModel) {
  currentFile.value = file || new FileModel({
    id: 0,
    name: '',
    originalName: '',
    mimeType: '',
    extension: '',
    size: 0,
    path: '',
  })
  isAddDialogShown.value = true
}

async function handleFile(file: FileModel) {
  await FileService.save(file, fileObject.value)
  isAddDialogShown.value = false
  fileObject.value = undefined
  currentFile.value = undefined
}

// Remove
function openRemoveDialog(file: FileModel) {
  fileToRemove.value = file
  isRemoveDialogShown.value = true
}

async function removeFile() {
  const file = fileToRemove.value as FileModel
  await FileService.remove(file)
  isRemoveDialogShown.value = false
  fileToRemove.value = undefined
}
</script>

<style lang="scss" scoped>
.file-data {
  border: 1px solid #bababa;
  border-radius: 6px;;
  padding: 8px;
}
</style>
