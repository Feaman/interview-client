<template lang="pug">
span {{ props.file.sizeInMegabytes || props.file.sizeInBytes }}
span.size.text-grey-5 {{ t(props.file.sizeInMegabytes ? 'MiB' : 'KiB') }}
</template>

<script setup lang="ts">
import FileModel from '~/models/file-model'
import { t } from '~/services/translate'

const props = defineProps({
  file: { type: FileModel, required: true },
})
</script>

<style lang="scss" scoped>
.size {
  padding-left: 1px;
}
</style>
