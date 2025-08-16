<script setup lang="ts">
  import DarkModeToggle from './DarkModeToggle.vue'
</script>

<template>
  <!-- Top gradient bar -->
  <div class="top-gradient" />

  <!-- Header -->
  <v-container class="pt-8">
    <v-row align="center" justify="space-between">
      <v-col class="d-flex align-center" cols="auto">
        <router-link class="d-flex align-center text-decoration-none" to="/">
          <div class="logo-chip mr-3">
            <v-icon color="white" icon="mdi-cards-playing-outline" size="20" />
          </div>
          <h2 class="mb-0">Planning Poker</h2>
        </router-link>
      </v-col>

      <v-col class="d-flex align-center ga-2" cols="auto">
        <DarkModeToggle />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-content {
  background-color: #f9f9f9;
}

.dark .main-content {
  background-color: #121212;
}

.dark h2 {
  color: #ffffff;
}

.top-gradient {
  height: 4px;
  background: linear-gradient(90deg, #f43f5e, #a855f7, #f59e0b);
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 10;
}
.logo-chip {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.25);
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  border: 1px solid rgba(168, 85, 247, 0.35);
  background: rgba(250, 245, 255, 0.8);
}
.display-2 {
  font-weight: 800;
  letter-spacing: -0.02em;
}
.glass {
  backdrop-filter: blur(6px);
  background: color-mix(in oklab, var(--v-theme-surface) 80%, transparent);
}
.soft-surface {
  background: color-mix(in oklab, var(--v-theme-surface) 90%, var(--v-theme-on-surface) 5%);
}
.mini-accent {
  width: 96px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.gradient-btn {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  color: white !important;
}
.gradient-slab {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.footer-gradient {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.max-w-400{ max-width: 400px; }

:deep(a.text-white) {
  text-decoration: none;
}

:deep(a.text-white:hover) {
  text-decoration: none;
}
</style>
