<template lang="pug">
  q-page
    MainList(
      v-if="candidates.length"
    )
    q-card.text-center.shadow-0.mt-6.py-8(
      :bordered="!isMobile"
      :class="{ 'borders-y': isMobile }"
    )
      q-card-section
        .font-size-24.text-grey-7.text-uppercase No one candidate found
        q-btn.mt-8(
          @click="$router.push('/sign')"
          color="purple"
          label="Try to add one"
        )
</template>

<script setup lang="ts">
import { candidates, isMobile } from '~/composables'

defineOptions({
  name: 'IndexPage',
})
</script>
