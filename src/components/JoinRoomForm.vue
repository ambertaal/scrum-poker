<script setup lang="ts">
  import { computed } from 'vue'

  const { id } = defineProps<{ id: string }>()

  const emit = defineEmits<{
    (e: 'update:id', value: string): void
    (e: 'submit'): void
  }>()

  const joinRoomId = computed({
    get: () => id,
    set: (newRoomId: string) => emit('update:id', newRoomId),
  })

  const handleSubmit = () => {
    emit('submit')
  }

  const isDisabled = computed(() => joinRoomId.value.trim().length < 6)

</script>

<template>
  <h3 class="text-subtitle-1 font-weight-bold mb-2">Enter existing room</h3>

  <v-text-field
    v-model="joinRoomId"
    class="mb-4 roomnumber-input"
    dense
    label="Room number"
    outlined
    placeholder="e.g. 123456"
    :rules="[v => v.length >= 6 || 'Room number must be at least 6 characters']"
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

<style scoped>
.gradient-btn {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  color: white !important;
}
</style>
