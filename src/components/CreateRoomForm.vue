<script setup lang="ts">
  import { computed } from 'vue'

  const { name } = defineProps<{ name: string }>()

  const emit = defineEmits<{
    (e: 'update:name', value: string): void
    (e: 'submit'): void
  }>()

  const username = computed({
    get: () => name,
    set: (val: string) => emit('update:name', val),
  })

  const handleSubmit = () => {
    emit('submit')
  }

  const nameRules = [
    (v: string) => !!v.trim() || 'Please enter at least one letter',
  ]

  const isDisabled = computed(() => username.value.trim().length === 0)
</script>

<template>
  <h2 class="font-weight-bold mb-6">Create a new room</h2>

  <v-text-field
    v-model="username"
    class="mb-4 name-input"
    dense
    label="Display Name"
    outlined
    placeholder="e.g. Display Room"
    :rules="nameRules"
    @keydown.enter="handleSubmit"
  />

  <v-btn
    block
    color="deep-purple-accent-4"
    :disabled="isDisabled"
    large
    @click="handleSubmit"
  >
    Create Room
  </v-btn>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
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

.dark .v-btn:disabled {
  color: rgb(255, 255, 255) !important;
  background-color: #7C4DFF !important;
  border: none;
}

.v-btn:focus-visible {
  outline: 2px solid #0000ff;
  outline-offset: 2px;
  border-radius: 8px;
}

.dark .v-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  border-radius: 8px;
}
</style>
