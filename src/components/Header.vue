<script setup lang="ts">
  import DarkModeToggle from './DarkModeToggle.vue'
</script>

<template>
  <v-app-bar
    color="grey-darken-3"
    density="comfortable"
    location="top"
    scroll-behavior="hide"
  >
    <v-container fluid>
      <v-row align="center" justify="space-between" no-gutters>

        <!-- Logo / Title -->
        <v-col class="d-flex align-center">
          <router-link class="text-white text-decoration-none text-h6 font-weight-bold" to="/">
            Planning poker
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
.text-decoration-none {
  text-decoration: none;
}
.text-decoration-none:hover {
  text-decoration: none;
}

.v-app-bar {
  border-bottom: 1px solid #444;
}
</style>
