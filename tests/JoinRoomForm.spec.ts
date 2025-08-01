import { afterEach, describe, expect, it, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import JoinRoomForm from '../src/components/JoinRoomForm.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ComponentPublicInstance } from 'vue'

interface JoinRoomFormProps {
  id: string
}

type JoinRoomFormComponent = ComponentPublicInstance<JoinRoomFormProps>;

const vuetify = createVuetify({
  components,
  directives,
})

describe('JoinRoomForm component', () => {
  let wrapper: VueWrapper<JoinRoomFormComponent>

  const defaultProps = {
    id: '123456',
  }

  const mountJoinRoomForm = (props = {}) => {
    return mount(JoinRoomForm, {
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
    wrapper = mountJoinRoomForm()
    expect(wrapper.find('h3').text()).toBe('Enter existing room')
  })

  test('binds the input value to the name prop', async () => {
    wrapper = mountJoinRoomForm()

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('123456')
  })

  test('emits update:id when input changes', async () => {
    wrapper = mountJoinRoomForm({ id: '' })

    const input = wrapper.find('input')
    await input.setValue('654321')
    expect(wrapper.emitted('update:id')).toBeTruthy()
    expect(wrapper.emitted('update:id')![0]).toEqual(['654321'])
  })

  test('emits submit when button is clicked', async () => {
    wrapper = mountJoinRoomForm({ id: '' })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('emits submit when enter is pressed in input', async () => {
    wrapper = mountJoinRoomForm({ id: '' })

    const input = wrapper.find('input')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
