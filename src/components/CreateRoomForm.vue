<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ name: string }>()

  const emit = defineEmits<{
    (e: 'update:name', value: string): void
    (e: 'submit'): void
  }>()

  const username = computed({
    get: () => props.name,
    set: (val: string) => emit('update:name', val),
  })

  const handleSubmit = () => {
    emit('submit')
  }
</script>

<template>
  <h2 class="font-weight-bold mb-6">Create a new room</h2>

  <v-text-field
    v-model="username"
    class="mb-4 name-input"
    dense
    label="Display Name"
    outlined
    placeholder="e.g. Dreplay Room"
    @keydown.enter="handleSubmit"
  />

  <v-btn block color="deep-purple-accent-4" large @click="handleSubmit">
    Create Room
  </v-btn>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
}

h2 {
  color: #1a1a1a;
}

.dark h2 {
  color: #ffffff;
}

.name-input {
  color: #1a1a1a;
}

.dark .name-input {
  color: #ffffff;
}
</style>
