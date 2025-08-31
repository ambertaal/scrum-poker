// tests/components/Header.spec.ts
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { mount, RouterLinkStub, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Header from '../../src/components/Header.vue'

const vuetify = createVuetify({ components, directives })

beforeAll(() => {
  vi.stubGlobal('visualViewport', {
    width: 1024, height: 768, scale: 1,
    offsetLeft: 0, offsetTop: 0, pageLeft: 0, pageTop: 0,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })
  vi.stubGlobal('ResizeObserver', class { observe () {} unobserve () {} disconnect () {} })
})

afterAll(() => vi.unstubAllGlobals())

const mountInApp = () =>
  mount(
    {
      components: { Header },
      template: '<v-app><Header /></v-app>',
    },
    {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: RouterLinkStub,
          DarkModeToggle: { template: '<div data-test="dark-toggle"></div>' },
        },
      },
      attachTo: document.body,
    },
  )

describe('Header.vue', () => {
  let wrapper: VueWrapper;

  afterEach(() => { if (wrapper) wrapper.unmount() })

  test('renders and shows product name', () => {
    wrapper = mountInApp()
    const title = wrapper.find('h2')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Planning Poker')
  })

  test('renders structure and app-bar props', () => {
    wrapper = mountInApp()
    const appBar = wrapper.findComponent({ name: 'VAppBar' })
    const container = wrapper.findComponent({ name: 'VContainer' })
    expect(appBar.exists()).toBe(true)
    expect(container.exists()).toBe(true)

    expect(appBar.props('density')).toBe('comfortable')
    expect(appBar.props('flat')).toBe(true)
    expect(appBar.classes()).toContain('header-bar')
  })

  test('router-link points to "/" and has expected classes', () => {
    wrapper = mountInApp()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/')

    const cls = link.attributes('class') ?? ''
    expect(cls).toContain('d-flex')
    expect(cls).toContain('align-center')
    expect(cls).toContain('text-decoration-none')
  })

  test('renders logo chip and icon with correct props', () => {
    wrapper = mountInApp()
    expect(wrapper.find('.logo-chip').exists()).toBe(true)

    const icon = wrapper.findComponent({ name: 'VIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('mdi-cards-playing-outline')
    expect(icon.props('color')).toBe('white')
    expect(icon.props('size')).toBe('20')
  })

  test('renders DarkModeToggle', () => {
    wrapper = mountInApp()
    expect(wrapper.find('[data-test="dark-toggle"]').exists()).toBe(true)
  })
})
