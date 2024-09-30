<template lang="pug">
q-page.template-page.my-4(
  v-if="template"
)
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
    q-breadcrumbs-el(
      :label="existingTemplate ? existingTemplate.title : 'New template'"
      icon="widgets"
    )

  q-card.shadow-0.mt-4(
    :bordered="!isMobile"
    :class="{ 'borders-y': isMobile }"
  )
    q-card-section.row.items-center.q-pb-none.bg-grey-3.py-2
      .text-h6.text-uppercase {{ template.id ? 'Edit' : 'Create' }} template
      q-space
      q-checkbox.text-purple(
        v-model="template.isDefault"
        label="is default"
      )
    q-separator
    .text-h6.mt-4.ml-4 Title
    q-card-section.pb-0.pt-1
      q-input(
        label="Title"
        v-model="template.title"
        hint="At least 3 letters"
        outlined
      )
      .text-h6.mt-6 Questions
      .template-page__question.rounded-borders.pa-3(
        v-for="(question, index) in template.questions"
        :class="{ 'mt-1': index === 0, 'mt-4': index !== 0 }"
      )
        div Title
        q-input.mt-1.col(
          :label="`Main question ${index + 1}`"
          v-model="question.title"
          outlined
        )

        .mt-4 Text
        q-input.mt-1(
          v-model="question.taskText"
          label="text"
          outlined
          dense
        )

        .mt-4 Links
        template(
          v-if="question.taskLinks"
        )
          .row(
            v-for="(link, index) in question.taskLinks"
          )
            q-input.mt-1.col(
              v-model="link.title"
              label="Link title"
              outlined
              dense
            )
            q-input.mt-1.ml-2.col(
              v-model="link.url"
              label="Link URL"
              outlined
              dense
            )
        q-btn(
          @click="addLink(question)"
          color="purple-7"
          :class="{ 'mt-2': question.taskLinks?.length }"
        ) add link

        .mt-4 Sub-questions
        .template-page__question.pa-2.rounded-borders(
          v-for="(subQuestion, index) in question.items"
          :class="{ 'mt-1': index === 0, 'mt-4': index !== 0 }"
        )
          div Title
          q-input.col(
            :label="`Sub-question ${index + 1}`"
            v-model="subQuestion.title"
            outlined
            dense
          )

          .mt-4 Text
          q-input.mt-1(
            v-model="subQuestion.taskText"
            label="text"
            outlined
            dense
          )

          .mt-4 Links
          template(
            v-if="subQuestion.taskLinks"
          )
            .row(
              v-for="(link, index) in subQuestion.taskLinks"
              :class="{ 'mt-1': index !== 0 }"
            )
              q-input.mt-1.col(
                v-model="link.title"
                label="Link title"
                outlined
                dense
              )
              q-input.mt-1.ml-2.col(
                v-model="link.url"
                label="Link URL"
                outlined
                dense
              )
          .row.items-center(
            :class="{ 'mt-2': subQuestion.taskLinks?.length }"
          )
            q-btn(
              @click="addLink(subQuestion)"
              color="purple-7"
            ) add link
            q-space
            q-btn.ml-2(
              @click="question.items.splice(index, 1)"
              color="red"
              label="Delete"
            )

        .row.items-center
          q-btn(
            @click="question.items.push({ title: '', items: [] })"
            :class="{ 'mt-2': question.items.length }"
            color="purple-7"
          ) add sub-question
          q-space
          q-btn.mt-2(
            @click="template.questions.splice(index, 1)"
            label="Delete"
            color="red"
          )

      q-btn(
        @click="template.questions.push({ title: '', items: [] })"
        :class="{ 'mt-4': template.questions.length }"
        color="purple-7"
      ) add main question

      .text-red.mt-6 {{ errorText }}

    q-card-actions(
      align="left"
    )
      q-btn(
        @click="save()"
        :loading="isTemplateLoading"
        :disabled="!isValid"
        :label="template.id ? 'Update' : 'Create'"
        color="purple"
        flat
        v-close-popup
      )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiClose } from '@quasar/extras/mdi-v6'
import { templates, isMobile, isTemplateLoading } from '~/composables'
import TemplateModel from '~/models/template-model'
import { ROUTE_NEW_TEMPLATE, ROUTE_TEMPLATES, ROUTE_INDEX } from '~/router/routes'
import TemplateService from '~/services/templates-service'
import QuestionModel from '~/models/question-model'

defineOptions({
  name: 'TemplatePage',
})

const router = useRouter()
const route = useRoute()
const errorText = ref('')
let currentTemplate: TemplateModel
let existingTemplate: TemplateModel | undefined

// Handle initial template
if (router.currentRoute.value.name === ROUTE_NEW_TEMPLATE) {
  currentTemplate = new TemplateModel({ id: 0, title: '', data: '[]' })
} else {
  existingTemplate = templates.value.find((_template) => _template.id === Number(route.params.id))
  if (!existingTemplate) {
    throw new Error(`Template with id "${route.params.id}" not found`)
  }
  currentTemplate = new TemplateModel(JSON.parse(JSON.stringify(existingTemplate)))
}

const template = ref(currentTemplate)
const isValid = computed(() => template.value.title.length >= 3 && template.value.questions.length)

async function save() {
  try {
    template.value.data = JSON.stringify(template.value.questions)
    await TemplateService.save(template.value)
    if (template.value.isDefault) {
      templates.value
        .filter((_template) => _template.id !== template.value.id)
        .forEach((_template) => {
          _template.isDefault = false
        })
    }
    if (existingTemplate) {
      Object.assign(existingTemplate, currentTemplate)
    }
    router.push({ name: ROUTE_TEMPLATES })
  } catch (error) {
    errorText.value = ((error as { response: { data: { message: string }}}).response?.data?.message) || ((error as Error).message) || 'Unexpected error'
  } finally {
    isTemplateLoading.value = false
  }
}

function addLink(question: QuestionModel) {
  if (!question.taskLinks) {
    question.taskLinks = []
  }
  question.taskLinks.push({ title: '', url: '' })
}
</script>

<style lang="scss" scoped>
.template-page {
  .template-page__question {
    border: 1px solid #9f48c3;
  }
}
</style>
