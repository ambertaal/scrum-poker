import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'
import EstimateOptions from '@/components/EstimateOptions.vue'
import type { EstimateOption } from "@/types/estimates";

interface EstimateOptionsProps {
  options: readonly EstimateOption[]
  counts?: Record<EstimateOption, number>
  reveal: boolean
  myChoice?: EstimateOption | null
}

type EstimateOptionsComponent = ComponentPublicInstance<EstimateOptionsProps>

beforeAll(() => {
  // Mock matchMedia used in the component
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false, // not mobile -> arrow "👉"
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

describe('EstimateOptions', () => {
  let wrapper: VueWrapper<EstimateOptionsComponent>

  const defaultProps: EstimateOptionsProps = {
    options: ['?', '☕', '0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
    reveal: false,
  }

  const mountEstimateOptions = (props: Partial<EstimateOptionsProps> = {}) => {
    return mount(EstimateOptions, {
      props: { ...defaultProps, ...props },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('renders subtitle with desktop arrow', () => {
    wrapper = mountEstimateOptions()
    expect(wrapper.find('p').text()).toBe('Pick your card 👉')
  })

  test('emits select event when an option is clicked', async () => {
    wrapper = mountEstimateOptions()
    const firstButton = wrapper.findAll('button')[0]
    await firstButton.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual(['?'])
  })
})
