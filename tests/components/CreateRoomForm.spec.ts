import { afterEach, describe, expect, it, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CreateRoomForm from '../../src/components/CreateRoomForm.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ComponentPublicInstance } from 'vue'

interface CreateRoomFormProps {
  name: string
}

type CreateRoomFormComponent = ComponentPublicInstance<CreateRoomFormProps>;

const vuetify = createVuetify({
  components,
  directives,
})

describe('CreateRoomForm component', () => {
  let wrapper: VueWrapper<CreateRoomFormComponent>

  const defaultProps = {
    name: 'amber',
  }

  const mountCreateRoomForm = (props = {}) => {
    return mount(CreateRoomForm, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  test('renders the title', () => {
    wrapper = mountCreateRoomForm()
    expect(wrapper.find('h2').text()).toBe('Create a new room')
  })

  test('binds the input value to the name prop', async () => {
    wrapper = mountCreateRoomForm()

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('amber')
  })

  test('emits update:name when input changes', async () => {
    wrapper = mountCreateRoomForm({ name: '' })

    const input = wrapper.find('input')
    await input.setValue('Bob')
    expect(wrapper.emitted('update:name')).toBeTruthy()
    expect(wrapper.emitted('update:name')![0]).toEqual(['Bob'])
  })

  test('emits submit when button is clicked', async () => {
    wrapper = mountCreateRoomForm({ name: 'amber' }) // not disabled
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('emits submit when enter is pressed in input', async () => {
    wrapper = mountCreateRoomForm({ name: '' })

    const input = wrapper.find('input')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
