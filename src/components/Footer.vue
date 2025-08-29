<template>
  <v-footer app>
    <v-sheet class="footer-gradient py-10" width="100%">
      <v-container>
        <v-row class="mb-2">
          <v-col cols="12" md="6">
            <div class="d-flex align-center">
              <div class="logo-chip mr-3">
                <v-icon color="white" icon="mdi-cards-playing-outline" size="20" />
              </div>
              <div class="text-h6 text-white">Planning Poker</div>
            </div>
            <p class="text-body-2 mt-3 text-white">Lightweight, real‑time Scrum Poker to keep your planning fast and focused.</p>
          </v-col>
        </v-row>
        <v-divider class="opacity-50" color="white" />
        <div class="d-flex justify-space-between align-center mt-4 text-caption text-white">
          <span>© {{ new Date().getFullYear() }} Planning Poker. All rights reserved.</span>
        </div>
      </v-container>
    </v-sheet>
  </v-footer>
</template>

<style scoped>
.logo-chip {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.25);
}

.footer-gradient {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}

:deep(a.text-white) {
  text-decoration: none;
}

:deep(a.text-white:hover) {
  text-decoration: none;
}
</style>
