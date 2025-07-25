<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col
        class="text-center"
        cols="12"
        lg="4"
        md="6"
        sm="8"
      >
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  background-color: #f9f9f9;
}

.dark .v-container {
  background-color: #121212;
}
</style>
