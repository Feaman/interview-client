<template lang="pug">
.fullscreen.bg-blue.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(
      style="font-size: 30vh"
    ) 404
    .text-h2(
      style="opacity:.4"
    ) Oops. Nothing here...
    q-btn.q-mt-xl(
      label="Go Home"
      color="white"
      text-color="blue"
      to="/"
      unelevated
      no-caps
    )
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound',
})
</script>
