<template lang="pug">
.default-layout.bg-grey-lighten-4.pa-10
  v-progress-circular(
    v-if="isConfigLoading && !isLoginRoute"
    color="purple"
    :size="70"
    :width="7"
    indeterminate
  )
  slot(v-else)
</template>

<script setup lang="ts">
// eslint-disable-next-line
import { isConfigLoading } from '~~/compositions/loaders'
const isLoginRoute = useRoute().name === 'login'
</script>

<style lang="stylus" scoped>
.default-layout
  height: 100vh
  overflow auto
</style>
