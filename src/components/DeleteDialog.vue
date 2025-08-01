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
          class="secondary"
          color="deep-purple-accent-4"
          text
          variant="outlined"
          @click="handleCancel"
        >Cancel</v-btn>
        <v-btn color="deep-purple-accent-4" variant="flat" @click="handleDelete">Delete</v-btn>
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
