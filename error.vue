<template lang="pug">
div
  div {{ error.message }}
  v-btn(
    @click="handleError"
  ) Clear errors
</template>

<script setup>
const props = defineProps({
  error: { type: Object, default: () => {} },
})

const handleError = () => clearError({ redirect: '/' })
</script>
