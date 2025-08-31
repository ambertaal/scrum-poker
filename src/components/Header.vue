<template>
  <v-app-bar class="header-bar" density="comfortable" flat>
    <v-container class="d-flex align-center justify-space-between">
      <router-link class="d-flex align-center text-decoration-none" to="/">
        <div class="logo-chip mr-3">
          <v-icon color="white" icon="mdi-cards-playing-outline" size="20" />
        </div>
        <h2 class="mb-0">Planning Poker</h2>
      </router-link>

      <DarkModeToggle />
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.header-bar,
.header-bar :deep(.v-toolbar__content) {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}

.header-bar :deep(.v-toolbar__content) {
  padding-inline: 0;
}

.header-bar h2 { color: #fff; }
.header-bar :deep(a) { color: #fff; text-decoration: none; }

.logo-chip {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.25);
}

.main-content {
  background-color: #f9f9f9;
}

.dark .main-content {
  background-color: #121212;
}

.dark h2 {
  color: #ffffff;
}

.gradient-btn {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  color: white !important;
}
.gradient-slab {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
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
