<template lang="pug">
.user.d-flex.justify-end.align-center(
  v-if="user"
)
  div {{ user.firstName }} {{ user.secondName }}
  div.text-grey.font-size-14.ml-2 {{ user.email }}
  v-btn.logout.ml-2.px-0(
    @click="logout"
    color="white"
    size="small"
  )
    v-icon(:icon="mdiLogoutVariant")
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
.user
  .logout
    min-width 28px
</style>
