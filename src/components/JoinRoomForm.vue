<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ id: string }>()

  const emit = defineEmits<{
    (e: 'update:id', value: string): void
    (e: 'submit'): void
  }>()

  const joinRoomId = computed({
    get: () => props.id,
    set: (val: string) => emit('update:id', val),
  })

  const handleSubmit = () => {
    emit('submit')
  }

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
    @keydown.enter="handleSubmit"
  />

  <v-btn block color="deep-purple-accent-4" variant="outlined" @click="handleSubmit">
    Join Room
  </v-btn>
</template>

<style scoped>
h3 {
  font-size: 1.125rem;
  color: #1a1a1a;
}

.dark h3 {
  color: #ffffff;
}

.roomnumber-input {
  color: #1a1a1a;
}

.dark .roomnumber-input {
  color: #ffffff;
}
</style>
