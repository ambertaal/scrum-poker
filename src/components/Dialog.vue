<script setup lang="ts">
  import { computed } from 'vue'
  import { useClipboard } from '@vueuse/core'
  import { useRouter } from 'vue-router'

  const { title, message, modelValue, variant, persistent = false, maxWidth = 400 , confirmText = 'OK', cancelText = 'Cancel', inputLabel = 'Value', name, roomId } = defineProps<{
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
  }>()

  const router = useRouter()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:name', value: string): void
    (e: 'submit', value?: string): void
    (e: 'cancel'): void
  }>()

  const showDialog = computed({
    get: () => modelValue,
    set: (isVisible: boolean) => emit('update:modelValue', isVisible),
  })

  /** nameDialog */
  const tempName = computed({
    get: () => name ?? '',
    set: (newTempName: string) => emit('update:name', newTempName),
  })

  /** shareDialog */
  const roomUrl = computed(() => {
    const href = router.resolve({ name: 'room', params: { roomId } }).href
    return `${window.location.origin}${href}`
  })

  const { copy, copied } = useClipboard()

  const copyUrl = async () => {
    await copy(roomUrl.value)
  }

  const handleSubmit = () => {
    emit('submit')
  }

  const handleCancel = () => {
    emit('cancel')
    showDialog.value = false
  }
</script>

<template>
  <v-dialog v-model="showDialog" :max-width="maxWidth" :persistent="persistent">
    <v-card>
      <v-card-title class="text-h6">
        <slot name="title">{{ title }}</slot>
      </v-card-title>

      <v-card-text>
        <slot>
          <!-- DeleteDialog -->
          <template v-if="variant === 'deleteDialog' && message">
            {{ message }}
          </template>

          <!-- NameDialog -->
          <template v-else-if="variant === 'nameDialog'">
            <p v-if="message" class="mb-2">{{ message }}</p>
            <v-text-field
              v-model="tempName"
              :label="inputLabel"
              variant="outlined"
              @keydown.enter="handleSubmit"
            />
          </template>

          <!-- ShareDialog -->
          <template v-else-if="variant === 'shareDialog'">
            <p v-if="message" class="mb-2">{{ message }}</p>
            <v-text-field
              append-icon="mdi-content-copy"
              :append-inner-icon="copied ? 'mdi-check' : ''"
              class="mt-4"
              hide-details
              :model-value="roomUrl"
              readonly
              variant="outlined"
              @click:append="copyUrl"
            />
          </template>
        </slot>
      </v-card-text>

      <v-card-actions>
        <slot name="actions">
          <v-spacer />
          <v-btn
            v-if="!hideCancel"
            class="secondary-btn"
            text
            variant="outlined"
            @click="handleCancel"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn
            v-if="!hideConfirm"
            class="primary-btn"
            variant="flat"
            @click="handleSubmit"
          >
            {{ confirmText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
