<script setup lang="ts">
  defineProps<{
    image: string;
    title: string;
    description: string;
  }>();

</script>

<template>
  <v-container class="mt-14">
    <v-row class="align-center" no-gutters>
      <v-col class="pr-md-8 mt-6 mt-md-0" cols="12" md="6">
        <v-img
          alt="Real-time estimation"
          class="rounded-lg elevation-6"
          cover
          height="320"
          :src="image"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-sheet class="rounded-xl pa-8 glass">
          <h3 class="text-h5 text-sm-h4">{{ title }}</h3>
          <p class="text-body-1 text-medium-emphasis mt-2">
            {{ description }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.glass {
  backdrop-filter: blur(6px);
  background: color-mix(in oklab, var(--v-theme-surface) 80%, transparent);
}
</style>
