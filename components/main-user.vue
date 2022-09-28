<template lang="pug">
.user.text-right
  div {{ user.firstName }} {{ user.secondName }}
  .text-grey {{ user.email }}
</template>

<script setup lang="ts">
import UserModel from '~~/models/user-model'
import { user } from '~/compositions/users'
</script>

<style scoped lang="stylus">
.candidate
  .candidate__content
    overflow auto
  .v-text-field :deep(input)
    font-size 44px
</style>
