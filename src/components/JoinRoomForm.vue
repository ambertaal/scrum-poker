<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { ref as dbRef, get } from 'firebase/database'
  import { db } from '@/firebase'

  const { id } = defineProps<{ id: string }>()
  const emit = defineEmits<{
    (e: 'update:id', value: string): void
    (e: 'submit'): void
  }>()

  /**
   * Local state: keep a raw field value so the user can type non-digits.
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

  /** DB-existence state */
  const roomExists = ref<boolean | null>(null)
  const checking = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /** Debounced watcher: only checks if room number has valid format */
  watch(rawRoomIdInput, roomIdInput => {
    roomExists.value = null

    if (debounceTimer) clearTimeout(debounceTimer)
    if (!isValidRoom(roomIdInput)) return

    debounceTimer = setTimeout(async () => {
      checking.value = true
      try {
        const roomNameRef = dbRef(db, `rooms/${roomIdInput}/roomId`)
        const snap = await get(roomNameRef)
        roomExists.value = snap.exists()
      } catch (e) {
        console.error('Error checking room existence:', e)
        roomExists.value = false
      } finally {
        checking.value = false
      }
    }, 500)
  })

  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  const roomNumberRule = (roomNumber: string) => {
    if (!isValidRoom(roomNumber) && roomExists.value === false) {
      return 'Room number must be at least 6 digits and contain only digits'
    }
    if (isValidRoom(roomNumber) && roomExists.value === false) {
      return 'Room does not exist'
    }
    return true
  }

  /**
   * Only propagate valid values to the parent; ignore invalid input.
   */
  watch(rawRoomIdInput, newRoomNumber => {
    if (isValidRoom(newRoomNumber)) {
      emit('update:id', newRoomNumber)
    }
  })

  const isDisabled = computed(() => {
    return !isValidRoom(rawRoomIdInput.value) || roomExists.value === false || checking.value
  })

  const handleSubmit = () => {
    if (!isValidRoom(rawRoomIdInput.value)) return
    if (roomExists.value === false) return
    if (checking.value) return

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

  <div v-if="checking" class="text-caption mb-3">Checking room…</div>

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
