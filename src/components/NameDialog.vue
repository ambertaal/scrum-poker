<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
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
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })

  const tempName = computed({
    get: () => props.name,
    set: (val: string) => emit('update:name', val),
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
        <v-btn color="deep-purple-accent-4" variant="flat" @click="handleSubmit">Submit</v-btn>
        <v-btn
          class="secondary"
          color="deep-purple-accent-4"
          text
          variant="outlined"
          @click="handleCancel"
        >Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
