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
        Invite people to join the room <strong>{{ roomName }}</strong><br />
        <p class="mt-4">{{ roomUrl }}</p>
        <v-btn
          class="mt-4"
          prepend-icon="mdi-content-copy"
          variant="text"
          @click="copyUrl"
        >
          {{ copied ? 'Copied!' : 'Copy URL to clipboard' }}
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="deep-purple-accent-4" variant="flat" @click="handleShareDone">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
}

.dark .v-card {
  background-color: #121212;
}

.dark .v-card-title {
  color: #ffffff;
}

.dark .v-card-text {
  color: #ffffff;
}
</style>
