import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import EstimateOptions from '../src/components/EstimateOptions.vue'

interface EstimateOptionsProps {
  options: readonly string[];
}

type EstimateOptionsComponent = ComponentPublicInstance<EstimateOptionsProps>;

const vuetify = createVuetify({
  components,
  directives,
})

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

describe('estimateOptions', () => {
  let wrapper: VueWrapper<EstimateOptionsComponent>;

  const defaultProps = {
    options: ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
  };

  const mountEstimateOptions = (props = {}) => {
    return mount(EstimateOptions, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    });
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  test('renders subtitle', () => {
    wrapper = mountEstimateOptions()
    expect(wrapper.find('p').text()).toBe('Pick your card 👉')
  });

  test('emits select event when an option is clicked', async () => {
    wrapper = mountEstimateOptions()
    const firstButton = wrapper.findAll('button')[0]
    await firstButton.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual(['?'])
  });
})
