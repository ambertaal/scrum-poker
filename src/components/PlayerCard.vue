<script setup lang="ts">
  defineProps<{ name: string; estimate: string | null; reveal: boolean }>()
</script>

<template>
  <v-col class="d-flex flex-column align-center" cols="auto">
    <div class="flip-card" :class="{ flipped: reveal }">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <v-card class="d-flex align-center justify-center" color="blue-lighten-4" height="140" width="100">
            <span v-if="!estimate">?</span>
            <v-icon v-else>mdi-cards</v-icon>
          </v-card>
        </div>
        <div class="flip-card-back">
          <v-card class="d-flex align-center justify-center" color="white" height="140" width="100">
            <span class="text-h5 player-estimate">{{ estimate }}</span>
          </v-card>
        </div>
      </div>
    </div>
    <span class="mt-2 player-name">{{ name }}</span>
  </v-col>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  width: 100px;
  height: 140px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.dark .player-name {
  color: #ffffff;
}
</style>
