<script setup lang="ts">
  import DarkModeToggle from './DarkModeToggle.vue'
</script>

<template>
  <v-app-bar
    class="gradient-header text-white"
    density="comfortable"
    :elevation="0"
    location="top"
    scroll-behavior="hide"
  >
    <v-container fluid>
      <v-row align="center" justify="space-between" no-gutters>

        <!-- Logo / Title -->
        <v-col class="d-flex align-center">
          <router-link class="text-white text-decoration-none text-h6 font-weight-bold" to="/">
            <div class="d-flex align-center">
              <AppIcon class="mr-2" />
              <h2 class="mb-0">Planning poker</h2>
            </div>
          </router-link>
        </v-col>

        <!-- Right side: dark mode toggle -->
        <v-col class="d-flex justify-end align-center" cols="auto">
          <DarkModeToggle class="mr-2" />
        </v-col>

      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.gradient-header {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.text-decoration-none {
  text-decoration: none;
}
.text-decoration-none:hover {
  text-decoration: none;
}
</style>
