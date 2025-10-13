<template>
  <v-footer class="pa-0 footer-no-grow">
    <v-sheet class="footer-gradient py-10" width="100%">
      <v-container>
        <v-row class="mb-2">
          <v-col cols="12" md="6">
            <div class="d-flex align-center">
              <div class="mr-3">
                <img alt="Planning Poker logo" class="logo-image" src="@/assets/logo.svg" >

                <!-- <v-icon color="white" icon="mdi-cards-playing-outline" size="20" /> -->
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
.footer-no-grow {
  flex: 0 0 auto !important;
  align-items: stretch;
  padding: 0 !important;
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
