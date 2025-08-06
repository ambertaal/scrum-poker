<script setup lang="ts">
  import { computed } from 'vue'

  const { modelValue } = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:name', value: string): void
    (e: 'submit'): void
    (e: 'cancel'): void
  }>()

  const showDeleteDialog = computed({
    get: () => modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })

  const handleDelete = () => {
    emit('submit')
  }

  const handleCancel = () => {
    emit('cancel')
    showDeleteDialog.value = false
  }
</script>

<template>
  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Clear room</v-card-title>
      <v-card-text>Are you sure you want to delete all participants in the room?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="secondary-btn"
          text
          variant="outlined"
          @click="handleCancel"
        >Cancel</v-btn>
        <v-btn class="primary-btn" variant="flat" @click="handleDelete">Delete</v-btn>
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

.primary-btn {
  background-image: linear-gradient(40deg, #4c1f82, #8c1d82 14%, #cf0220 50%, #ffb15c);
  border-radius: 9999px;
  box-shadow: 0 2px 6px #0000004d;
  color: white;
  font-weight: 500;
  text-transform: none;
}

.primary-btn:hover {
  filter: brightness(1.1);
}

.primary-btn:disabled {
  filter: grayscale(0.5);
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  border-radius: 9999px;
}
</style>
