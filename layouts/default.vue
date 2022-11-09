<template lang="pug">
.default-layout.d-flex.flex-center.bg-grey-lighten-4
  v-progress-circular(
    v-if="isConfigLoading && !isLoginRoute"
    color="purple"
    :size="70"
    :width="7"
    indeterminate
  )
  .default-layout__main.d-flex.flex-column.px-10.pb-10(v-else)
    main-user.pt-2(v-if="user")
    div.pt-4
      slot
</template>

<script setup lang="ts">
import { isConfigLoading } from '~/compositions/loaders'
import { user } from '~/compositions/users'

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.png?version=1' },
  ]
})

const isLoginRoute = useRoute().name === 'login'
</script>

<style lang="stylus" scoped>
.default-layout
  height 100vh
  overflow auto

  .default-layout__main
    width 100%
    max-width 936px
</style>
