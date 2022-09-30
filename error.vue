<template lang="pug">
.error.d-flex.flex-center.bg-grey-lighten-2.pa-10
  v-card(
    width="300"
  )
    v-card-text
      .status(
        v-if="error.statusCode"
      ) {{ error.statusCode }}
      h2
        span.text-red Error:
        span.text-grey.ml-2 {{ error.message }}
      v-btn.mt-4(
        @click="handleError"
        color="blue"
      )
        .text-white Go to the main page
</template>

<script setup>
const props = defineProps({
  error: { type: Object, default: () => {} },
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="stylus" scoped>
.error
  height: 100vh

  .status
    width 54px
    color white
    padding 8px
    margin-bottom: 16px
    text-align center
    background-color blue
    border-radius 16px
    font-weight bold
    font-size 20px
</style>
