<template lang="pug">
.person-avatar(
  :class="{ 'person-avatar--bordered': photoPath && !noBorder }"
)
  q-avatar.text-grey-7(
    @click="pickAFile()"
    :class="{ 'cursor-pointer': isClickable }"
    :color="props.color || 'grey-3'"
    :size="props.size || '72px'"
  )
    img(
      v-if="photoPath"
      :src="photoPath"
    )
    template(v-else) {{ initials || '?' }}
</template>

<script setup lang="ts">
const props = defineProps({
  photoPath: { type: String, required: true },
  initials: { type: String, required: false },
  isClickable: { type: Boolean, required: false },
  size: { type: String, required: false },
  color: { type: String, required: false },
  noBorder: { type: Boolean, required: false },
})

const emit = defineEmits<{
  'update:photo': [file: File]
}>()

function pickAFile() {
  if (props.isClickable) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg, image/*'

    input.onchange = (event) => {
      const $element = event.target as HTMLInputElement
      const file = $element.files ? $element.files[0] : undefined
      if (file) {
        emit('update:photo', file)
      }
    }

    input.click()
  }
}
</script>

<style lang="scss" scoped>
.person-avatar {
  &.person-avatar--bordered {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 50%;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
