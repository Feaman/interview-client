<template lang="pug">
q-page.templates-page.mt-4
  q-breadcrumbs.bg-grey-4.py-2.pl-2(
    :bordered="!isMobile"
    :class="{ 'rounded-borders': !isMobile, 'borders-y': isMobile }"
     gutter="none"
  )
    template(
      v-slot:separator
    )
      q-icon(
        name="chevron_right"
        color="primary"
        size="1.5em"
      )
    q-breadcrumbs-el.ml-1(
      :to="{ name: ROUTE_INDEX }"
      label="Candidates"
      icon="home"
    )
    q-breadcrumbs-el(
      :to="{ name: ROUTE_TEMPLATES }"
      label="Templates"
      icon="widgets"
    )

  q-card.text-center.shadow-0.mt-6.py-8(
    v-if="!templates.length"
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section
      .font-size-24.text-grey-7.text-uppercase No one template found
      q-btn.mt-8(
        @click="router.push({ name: ROUTE_NEW_TEMPLATE })"
        color="purple"
        label="Try to add one"
      )
  q-list.rounded-borders.bg-white.my-4(
    v-else
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
    separator
  )
    q-item(
      v-for="template in templates"
      @click="router.push({ name: ROUTE_UPDATE_TEMPLATE, params: { id: template.id } })"
      clickable
      v-ripple
    )
      q-item-section.pa-1
        q-item-label.row.font-size-16.text-grey-9 {{ template.title }}
        q-item-label.font-size-14(caption) {{ template.questions.length }} main questions
      q-item-section
        .row
          q-space
          q-badge.font-size-14.py-1(
            v-if="template.isDefault"
            color="purple-5"
          ) default
      q-item-section(
        side
      )
        q-btn(
          @click.stop="openRemoveDialog(template)"
          :icon="mdiClose"
          flat
          round
        )

  q-page-sticky(
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      @click="router.push({ name: ROUTE_NEW_TEMPLATE })"
      color="accent"
      icon="add"
      fab
    )

  q-dialog(
    backdrop-filter="blur(4px)"
    v-model="isRemoveDialogShown"
  )
    q-card
      q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
        .text-h6.text-uppercase Delete template
      q-separator
      q-card-section.pb-2
        q-list.rounded-borders(
          bordered
        )
          q-item.px-3
            q-item-section.pa-1
              q-item-label.font-size-16.text-grey-9 {{ templateToRemove.title }}
              q-item-label.font-size-14(caption) {{ templateToRemove.questions.length }} main questions
            q-item-section(side)
              q-badge.font-size-14.py-1(
                v-if="templateToRemove.isDefault"
                color="purple-5"
              ) default
      q-card-actions(
        align="left"
      )
        q-btn(
          @click="removeTemplate()"
          :loading="isTemplateLoading"
          label="Delete"
          color="red"
          flat
          v-close-popup
        )
        q-space
        q-btn(
          label="Close"
          flat
          v-close-popup
        )
</template>

<script setup lang="ts">
import { mdiClose } from '@quasar/extras/mdi-v6'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { templates, isMobile, isTemplateLoading } from '~/composables'
import TemplateModel from '~/models/template-model'
import {
  ROUTE_NEW_TEMPLATE, ROUTE_UPDATE_TEMPLATE, ROUTE_TEMPLATES, ROUTE_INDEX,
} from '~/router/routes'
import TemplateService from '~/services/templates-service'

defineOptions({
  name: 'TemplatesPage',
})

const router = useRouter()
const isRemoveDialogShown = ref(false)
const templateToRemove = ref <TemplateModel | undefined>(undefined)

function openRemoveDialog(template: TemplateModel) {
  templateToRemove.value = template
  isRemoveDialogShown.value = true
}

async function removeTemplate() {
  const template = templateToRemove.value as TemplateModel
  await TemplateService.remove(template)
  templates.value = templates.value.filter((_template) => _template.id !== template.id)
  isRemoveDialogShown.value = false
  templateToRemove.value = undefined
}
</script>
