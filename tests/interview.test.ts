import { describe, expect, test } from 'vitest'
import { setup } from '@nuxt/test-utils-edge'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import MainListComponent from '~/components/main-list.vue'

describe('Main list', () => {
  // setup()
  const vuetify = createVuetify({ components, directives })
  const wrapper = mount(MainListComponent, {
    global: {
      plugins: [vuetify],
    },
    props: { },
  })

  test('title', () => {
    const title = wrapper.find('.text-h3')
    expect(title.exists())
    expect(title.element.textContent).toBe('Candidates')
  })
  test('candidates', () => {
    const candidates = wrapper.find('#candidates')
    expect(candidates.exists())
  })
})
