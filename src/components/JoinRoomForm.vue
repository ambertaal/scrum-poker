<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  const { id } = defineProps<{ id: string }>()
  const emit = defineEmits<{
    (e: 'update:id', value: string): void
    (e: 'submit'): void
  }>()

  /**
   * Local state: keep a raw field value so the user can type non-digits.
   * We only propagate to the parent when the value is valid (>=6 digits, digits-only).
   */
  const rawRoomIdInput = ref<string>(id ?? '')

  /**
   * Keep local field in sync if parent changes id externally.
   */
  watch(
    () => id,
    newId => {
      if (newId !== rawRoomIdInput.value) {
        rawRoomIdInput.value = newId ?? ''
      }
    }
  )

  const isValidRoom = (roomNumber: string) => /^\d{6,}$/.test(roomNumber)

  const roomNumberRule = (roomNumber: string) =>
    isValidRoom(roomNumber) ||
    'Room number must be at least 6 digits and contain only digits'

  /**
   * Only propagate valid values to the parent; ignore invalid input.
   */
  watch(rawRoomIdInput, newRoomNumber => {
    if (isValidRoom(newRoomNumber)) {
      emit('update:id', newRoomNumber)
    }
  })

  const isDisabled = computed(() => !isValidRoom(rawRoomIdInput.value))

  const handleSubmit = () => {
    if (isValidRoom(rawRoomIdInput.value)) {
      emit('submit')
    }
  }
</script>

<template>
  <h3 class="text-subtitle-1 font-weight-bold mb-2">Enter existing room</h3>

  <v-text-field
    v-model="rawRoomIdInput"
    autocomplete="one-time-code"
    class="mb-4 roomnumber-input"
    dense
    inputmode="numeric"
    label="Room number"
    outlined
    placeholder="e.g. 123456"
    :rules="[roomNumberRule]"
    type="text"
    validate-on="input"
    @keydown.enter="handleSubmit"
  />

  <v-btn
    block
    class="gradient-btn"
    :disabled="isDisabled"
    rounded="pill"
    variant="outlined"
    @click="handleSubmit"
  >
    Join Room
  </v-btn>
</template>
