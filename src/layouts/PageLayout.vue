<template>
  <div class="page-layout">
    <Header />

    <v-main class="page-content">
      <v-container class="py-0">
        <v-row align="center" justify="center">
          <v-col
            class="text-center"
            cols="12"
            lg="12"
            md="12"
            sm="12"
          >
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer />
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.v-container {
  background-color: #f9f9f9;
}

.dark .v-container {
  background-color: #2A1449;
}
</style>
