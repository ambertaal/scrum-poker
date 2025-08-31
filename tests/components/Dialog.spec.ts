import { afterEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Dialog from '../../src/components/Dialog.vue'

interface DialogProps {
  modelValue: boolean,
  title: string,
  message?: string,
  variant: 'nameDialog' | 'deleteDialog' | 'shareDialog',
  persistent?: boolean,
  maxWidth?: number | string,
  confirmText?: string,
  cancelText?: string,
  name?: string,
  inputLabel?: string,
  roomId?: string
  hideCancel?: boolean,
  hideConfirm?: boolean
}

type DialogComponent = ComponentPublicInstance<DialogProps>;

const vuetify = createVuetify({
  components,
  directives,
})

describe('dialog', () => {
  let wrapper: VueWrapper<DialogComponent>

  const defaultProps = {
    modelValue: false,
    title: 'Default Title',
    message: 'Default Message',
    variant: 'nameDialog',
    persistent: false,
    maxWidth: '600px',
    confirmText: 'Submit',
    cancelText: 'Cancel',
    name: 'default-name',
    inputLabel: 'Display Name',
    roomId: '123456',
    hideCancel: false,
    hideConfirm: false,
  }

  const mountDialog = (props = {}) => {
    return mount(Dialog, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  })

  test('renders correctly', () => {
    wrapper = mountDialog()
    expect(wrapper.exists()).toBe(true)
  })

})
