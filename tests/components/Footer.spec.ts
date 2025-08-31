import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Footer from '../../src/components/Footer.vue'

const vuetify = createVuetify({ components, directives })

beforeAll(() => {
  vi.stubGlobal('visualViewport', {
    width: 1024,
    height: 768,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
  vi.stubGlobal('ResizeObserver', class {
    observe () {}
    unobserve () {}
    disconnect () {}
  })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('Footer.vue', () => {
  let wrapper: VueWrapper;

  const mountFooter = () =>
    mount(Footer, {
      global: { plugins: [vuetify] },
    })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('renders and shows brand name', () => {
    wrapper = mountFooter()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Planning Poker')
  })

  test('shows tagline text', () => {
    wrapper = mountFooter()
    expect(wrapper.text()).toContain('Lightweight')
    expect(wrapper.text()).toContain('Scrum Poker')
  })

  test('renders structure components', () => {
    wrapper = mountFooter()
    const vFooter = wrapper.findComponent({ name: 'VFooter' })
    const vSheet = wrapper.findComponent({ name: 'VSheet' })
    const vContainer = wrapper.findComponent({ name: 'VContainer' })
    const vRow = wrapper.findComponent({ name: 'VRow' })
    const vCol = wrapper.findComponent({ name: 'VCol' })
    const vDivider = wrapper.findComponent({ name: 'VDivider' })

    expect(vFooter.exists()).toBe(true)
    expect(vSheet.exists()).toBe(true)
    expect(vContainer.exists()).toBe(true)
    expect(vRow.exists()).toBe(true)
    expect(vCol.exists()).toBe(true)
    expect(vDivider.exists()).toBe(true)
  })

  test('footer has zero padding class and gradient on sheet', () => {
    wrapper = mountFooter()
    const vFooter = wrapper.findComponent({ name: 'VFooter' })
    const vSheet = wrapper.findComponent({ name: 'VSheet' })

    expect(vFooter.classes()).toContain('pa-0')
    expect(vSheet.classes()).toContain('footer-gradient')

    expect(vSheet.props('width')).toBe('100%')
  })

  test('renders logo icon with correct props and chip container', () => {
    wrapper = mountFooter()
    const chip = wrapper.find('.logo-chip')
    expect(chip.exists()).toBe(true)

    const vIcon = wrapper.findComponent({ name: 'VIcon' })
    expect(vIcon.exists()).toBe(true)
    expect(vIcon.props('icon')).toBe('mdi-cards-playing-outline')
    expect(vIcon.props('color')).toBe('white')
    expect(vIcon.props('size')).toBe('20')
  })

  test('shows the current year in copyright line', () => {
    wrapper = mountFooter()
    const year = new Date().getFullYear().toString()
    const text = wrapper.text()
    expect(text).toContain(`© ${year}`)
    expect(text).toContain('Planning Poker')
    expect(text).toContain('All rights reserved.')
  })
})
