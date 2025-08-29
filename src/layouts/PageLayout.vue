<template>
  <div class="page-layout">
    <Header />

    <v-main class="page-content">
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col
            class="text-center"
            cols="12"
            lg="12"
            md="8"
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
}

.page-content {
  display: flex;
  flex-direction: column;
}

.v-container {
  background-color: #f9f9f9;
}

.dark .v-container {
  background-color: #121212;
}
</style>
