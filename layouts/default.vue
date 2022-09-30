<template lang="pug">
.default-layout.bg-grey-lighten-4
  v-progress-circular(
    v-if="isConfigLoading && !isLoginRoute"
    color="purple"
    :size="70"
    :width="7"
    indeterminate
  )
  .d-flex.flex-column.px-10.pb-10(v-else)
    main-user.pt-2(v-if="user")
    div.pt-4
      slot
</template>

<script setup lang="ts">
// eslint-disable-next-line
import { isConfigLoading } from '~~/compositions/loaders'
import { user } from '~/compositions/users'

const isLoginRoute = useRoute().name === 'login'
</script>

<style lang="stylus" scoped>
.default-layout
  height: 100vh
  overflow auto
</style>
