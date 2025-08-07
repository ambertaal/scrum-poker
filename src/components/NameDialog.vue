<script setup lang="ts">
  import { computed } from 'vue'

  const { modelValue, name } = defineProps<{
    modelValue: boolean
    name: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:name', value: string): void
    (e: 'submit'): void
    (e: 'cancel'): void
  }>()

  const showNameDialog = computed({
    get: () => modelValue,
    set: (isVisible: boolean) => emit('update:modelValue', isVisible),
  })

  const tempName = computed({
    get: () => name,
    set: (newTempName: string) => emit('update:name', newTempName),
  })

  const handleSubmit = () => {
    emit('submit')
  }

  const handleCancel = () => {
    emit('cancel')
    showNameDialog.value = false
  }
</script>

<template>
  <v-dialog v-model="showNameDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h6">Provide your name to enter</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tempName"
          label="Display Name"
          outlined
          @keydown.enter="handleSubmit"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="secondary-btn"
          text
          variant="outlined"
          @click="handleCancel"
        >Cancel</v-btn>
        <v-btn class="primary-btn" variant="flat" @click="handleSubmit">Submit</v-btn>
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
