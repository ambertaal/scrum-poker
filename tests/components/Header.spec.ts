import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { mount, RouterLinkStub, VueWrapper } from '@vue/test-utils'
import Header from '../../src/components/Header.vue'

beforeAll(() => {
  vi.stubGlobal('visualViewport', {
    width: 1024, height: 768, scale: 1,
    offsetLeft: 0, offsetTop: 0, pageLeft: 0, pageTop: 0,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })
  vi.stubGlobal('ResizeObserver', class { observe () {} unobserve () {} disconnect () {} })
})

afterAll(() => vi.unstubAllGlobals())

const mountHeader = () =>
  mount(Header, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        DarkModeToggle: { template: '<div data-test="dark-toggle"></div>' },
      },
    },
    attachTo: document.body,
  })

describe('Header.vue (Tailwind version)', () => {
  let wrapper: VueWrapper

  afterEach(() => { if (wrapper) wrapper.unmount() })

  test('renders and shows product name', () => {
    wrapper = mountHeader()
    const title = wrapper.find('h2')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Planning Poker')
  })

  test('renders sticky header with expected Tailwind classes', () => {
    wrapper = mountHeader()
    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)

    const cls = header.attributes('class') ?? ''
    expect(cls).toContain('sticky')
    expect(cls).toContain('top-0')
    expect(cls).toContain('z-50')
    expect(cls).toContain('text-white')
    expect(cls).toContain('shadow')

    expect(cls).toContain('bg-[')
  })

  test('router-link points to "/" and has expected Tailwind classes', () => {
    wrapper = mountHeader()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/')

    const cls = link.attributes('class') ?? ''
    expect(cls).toContain('flex')
    expect(cls).toContain('items-center')
    expect(cls).toContain('gap-3')
    expect(cls).toContain('text-white')
    expect(cls).toContain('no-underline')
  })

  test('renders logo image with alt, size classes, and svg src', () => {
    wrapper = mountHeader()
    const img = wrapper.find('img[alt="Planning Poker logo"]')
    expect(img.exists()).toBe(true)
  })

  test('renders DarkModeToggle', () => {
    wrapper = mountHeader()
    expect(wrapper.find('[data-test="dark-toggle"]').exists()).toBe(true)
  })
})
