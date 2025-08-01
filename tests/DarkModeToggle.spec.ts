import { afterEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import DarkModeToggle from '../src/components/DarkModeToggle.vue'

describe('DarkModeToggle component', () => {
  let wrapper: VueWrapper;

  const mountDarkModeToggle = () => {
    return mount(DarkModeToggle)
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('renders the switch input', () => {
    wrapper = mountDarkModeToggle()
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  test('checkbox reflects isDark state', async () => {
    wrapper = mountDarkModeToggle()
    const input = wrapper.find('input[type="checkbox"]')
    expect((input.element as HTMLInputElement).checked).toBe(false)
  })
})
