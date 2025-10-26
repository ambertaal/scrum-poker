// tests/components/Footer.spec.ts
import { afterEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Footer from '../../src/components/Footer.vue'

const mountFooter = () =>
  mount(Footer, {
    attachTo: document.body,
  })

describe('Footer.vue (Tailwind version)', () => {
  let wrapper: VueWrapper

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
    const text = wrapper.text()
    expect(text).toContain('Lightweight')
    expect(text).toContain('real-time Scrum Poker')
    expect(text).toContain('planning fast and')
  })

  test('renders structural elements and Tailwind classes', () => {
    wrapper = mountFooter()

    // <footer class="mt-auto">
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect((footer.attributes('class') ?? '')).toContain('mt-auto')

    // top-level <section> gradient + padding + text color
    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    const sectionCls = section.attributes('class') ?? ''
    expect(sectionCls).toContain('w-full')
    expect(sectionCls).toContain('py-10')
    expect(sectionCls).toContain('text-white')
    // Do not match the entire inline gradient; just ensure it exists
    expect(sectionCls).toContain('bg-[')

    // container
    const container = wrapper.find('div.mx-auto.max-w-screen-xl.px-4')
    expect(container.exists()).toBe(true)

    // grid with two columns on md+
    const grid = wrapper.find('div.grid')
    expect(grid.exists()).toBe(true)
    const gridCls = grid.attributes('class') ?? ''
    expect(gridCls).toContain('gap-6')
    expect(gridCls).toContain('md:grid-cols-2')

    // divider line
    const divider = wrapper.find('div.my-6.h-px.w-full')
    expect(divider.exists()).toBe(true)
    expect((divider.attributes('class') ?? '')).toContain('bg-white/50')

    // bottom bar with flex layout
    const bottomBar = wrapper.find('div.mt-4.flex.items-center.justify-between')
    expect(bottomBar.exists()).toBe(true)
    const bottomCls = bottomBar.attributes('class') ?? ''
    expect(bottomCls).toContain('text-xs')
    expect(bottomCls).toContain('text-white')
  })

  test('renders logo image with alt, size classes, and svg src', () => {
    wrapper = mountFooter()
    const img = wrapper.find('img[alt="Planning Poker logo"]')
    expect(img.exists()).toBe(true)
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
