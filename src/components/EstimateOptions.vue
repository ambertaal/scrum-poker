<script setup lang="ts">
  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

  defineProps<{
    options: readonly string[]
  }>()
  const emit = defineEmits<(event: 'select', value: string) => void>()
  const handleClick = (option: string) => emit('select', option)

  // Responsive arrow
  const isMobile = ref(false)
  const checkMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 600px)').matches
  }
  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
  })
  const arrow = computed(() => (isMobile.value ? '👇' : '👉'))
</script>

<template>
  <section class="mt-8">
    <v-row align="center" dense justify="center">
      <v-col cols="auto">
        <p class="text-subtitle-1 font-weight-bold mb-4 mb-md-0">
          Pick your card {{ arrow }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-row align="center" dense>
          <v-col v-for="option in options" :key="option" class="my-1" cols="auto">
            <v-btn
              :aria-label="`Select ${option}`"
              class="hover-effect text-h6 font-weight-bold"
              color="black"
              height="80"
              variant="outlined"
              width="60"
              @click="handleClick(option)"
            >
              {{ option }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.dark .text-subtitle-1 {
  color: #ffffff;
}

.hover-effect {
  transition: transform 0.2s, background-color 0.2s, color 0.2s;
  background-color: white;
  color: black;
  border: 1px solid darkgray;
}
.hover-effect:hover {
  background-color: #424242;
  color: white !important;
  transform: translateY(-5px);
}
</style>
