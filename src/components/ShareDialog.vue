<script setup lang="ts">
  import { computed } from 'vue'
  import { useClipboard } from '@vueuse/core'

  const { modelValue,roomName } = defineProps<{
    modelValue: boolean,
    roomName: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:name', value: string): void
    (e: 'cancel'): void
  }>()

  const showShareDialog = computed({
    get: () => modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })

  const handleShareDone = () => {
    emit('cancel')
    showShareDialog.value = false
  }

  const roomUrl = computed(() => {
    return `${window.location.origin}/room/${roomName}`
  })

  const { copy, copied } = useClipboard()

  const copyUrl = async () => {
    await copy(roomUrl.value)
  }
</script>

<template>
  <v-dialog v-model="showShareDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Share room</v-card-title>
      <v-card-text>
        Invite people to join the room.<br />
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
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="primary-btn" variant="flat" @click="handleShareDone">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
