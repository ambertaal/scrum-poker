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
