import { afterEach, describe, expect, it, test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance, ref } from 'vue'
import JoinRoomForm from '../../src/components/JoinRoomForm.vue'

interface JoinRoomFormProps {
  id: string
}

type JoinRoomFormComponent = ComponentPublicInstance<JoinRoomFormProps>

// Mock Player store used in the component
vi.mock('@/stores/player', () => {
  return {
    usePlayerStore: () => ({
      username: ref('Test User'),
      userId: ref('user-1'),
    }),
  }
})

// Mock Firebase database functions used in the debounced watcher
vi.mock('firebase/database', () => {
  return {
    ref: vi.fn((db, path) => ({ db, path })),
    get: vi.fn(async () => ({
      exists: () => false,
      val: () => null,
    })),
  }
})

// Mock firebase db instance
vi.mock('@/firebase', () => ({
  db: {},
}))

describe('JoinRoomForm component', () => {
  let wrapper: VueWrapper<JoinRoomFormComponent>

  const defaultProps: JoinRoomFormProps = {
    id: '123456',
  }

  const mountJoinRoomForm = (props: Partial<JoinRoomFormProps> = {}) => {
    return mount(JoinRoomForm, {
      props: { ...defaultProps, ...props },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
    vi.clearAllMocks()
  })

  test('renders the label/title', () => {
    wrapper = mountJoinRoomForm()
    expect(wrapper.find('label').text()).toBe('Enter existing room number')
  })

  test('binds the input value to the id prop', async () => {
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
    wrapper = mountJoinRoomForm({ id: '123456' })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('emits submit when enter is pressed in input', async () => {
    wrapper = mountJoinRoomForm({ id: '123456' })

    const input = wrapper.find('input')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
