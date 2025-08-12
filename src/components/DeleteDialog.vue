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
