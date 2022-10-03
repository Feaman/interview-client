<template lang="pug">
.user.d-flex.justify-end.align-center(
  v-if="user"
)
  div {{ user.firstName }} {{ user.secondName }}
  div.text-grey.font-size-14.ml-2 {{ user.email }}
  v-btn.ml-2(
    @click="logout"
    color="white"
    size="x-small"
    :icon="mdiLogoutVariant"
  )
</template>

<script setup lang="ts">
import { mdiLogoutVariant } from '@mdi/js'
import { user } from '~/compositions/users'
import UsersService from '~~/services/users-service'

function logout () {
  UsersService.logout()
}
</script>

<style scoped lang="stylus">
.candidate
  .candidate__content
    overflow auto
  .v-text-field :deep(input)
    font-size 44px
</style>
