<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'

  const playerStore = usePlayerStore()
  const { username } = storeToRefs(playerStore)

  const route = useRoute()
  const router = useRouter()

  const roomId = (route.params as { roomId: string }).roomId

  const players = ref<{ name: string; estimate: string | null }[]>([])
  const roomName = ref<string>(roomId)
  const revealEstimates = ref<boolean>(false)
  const showNameDialog = ref<boolean>(false)
  const tempName = ref<string>('')

  const estimateOptions = ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100']

  const hasEstimates = computed(() => players.value.some(p => p.estimate != null))

  const openNameDialog = () => {
    tempName.value = ''
    showNameDialog.value = true
  }

  const submitName = async () => {
    if (!tempName.value.trim()) return
    playerStore.setUsername(tempName.value)
    showNameDialog.value = false

    const playerRef = dbRef(db, `rooms/${roomId}/players/${username.value}`)
    await set(playerRef, { name: username.value, estimate: null })

    router.replace({ path: `/room/${roomId}`, query: { user: username.value } })
  }

  const cancelName = () => {
    showNameDialog.value = false
  }

  onMounted(() => {
    if (!username.value) {
      const userFromQuery = route.query.user as string
      if (userFromQuery) {
        playerStore.setUsername(userFromQuery)
      } else {
        openNameDialog()
      }
    }

    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    onValue(playersRef, snapshot => {
      const data = snapshot.val() as Record<string, { name: string; estimate: string | null }> | null
      players.value = data ? Object.entries(data).map(([key, val]) => ({ name: key, estimate: val.estimate })) : []
    })

    const roomNameRef = dbRef(db, `rooms/${roomId}/name`)
    onValue(roomNameRef, snapshot => roomName.value = snapshot.val())

    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    onValue(revealRef, snapshot => revealEstimates.value = snapshot.val() ?? false)
  })

  const castEstimate = async (estimate: string) => {
    if (!username.value) {
      openNameDialog()
      return
    }
    const estimateRef = dbRef(db, `rooms/${roomId}/players/${username.value}/estimate`)
    await set(estimateRef, estimate)
  }

  const toggleRevealEstimates = async () => {
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    await set(revealRef, !revealEstimates.value)
  }

  const resetEstimates = async () => {
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    const snapshot = await get(playersRef)
    if (!snapshot.exists()) return
    const updates: Record<string, null> = {}
    Object.keys(snapshot.val()).forEach(playerName => {
      updates[`rooms/${roomId}/players/${playerName}/estimate`] = null
    })
    await update(dbRef(db), updates)
  }
</script>

<template>
  <Header />
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col class="text-center" cols="12" md="10">
        <v-card class="pa-4 estimation-cards" elevation="0">

          <v-card-title class="text-h6">Room: {{ roomName }}</v-card-title>

          <v-row align="center" class="my-4" justify="center" no-gutters>
            <v-col
              v-for="(player, index) in players"
              :key="index"
              class="d-flex flex-column align-center"
              cols="auto"
            >
              <div class="flip-card" :class="{ flipped: revealEstimates }">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <v-card class="d-flex align-center justify-center" color="blue-lighten-4" height="140" width="100">
                      <span v-if="!player.estimate">?</span>
                      <v-icon v-else>mdi-cards</v-icon>
                    </v-card>
                  </div>
                  <div class="flip-card-back">
                    <v-card class="d-flex align-center justify-center" color="white" height="140" width="100">
                      <span class="text-h5 player-estimate">{{ player.estimate }}</span>
                    </v-card>
                  </div>
                </div>
              </div>
              <span class="mt-2 player-name">{{ player.name }}</span>
            </v-col>
          </v-row>

          <v-row class="my-4" justify="space-between">
            <v-col cols="auto">
              <v-btn class="contrast-fix" color="deep-purple-accent-4" :disabled="!hasEstimates" variant="outlined" @click="resetEstimates">Delete estimates</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="deep-purple-accent-4" @click="toggleRevealEstimates">
                {{ revealEstimates ? 'Hide Cards' : 'Reveal Cards' }}
              </v-btn>
            </v-col>
          </v-row>

          <section class="mt-8">
            <p class="text-subtitle-1 font-weight-bold mb-4">Pick your card 👉</p>
            <v-row align="center" dense justify="center">
              <v-col v-for="option in estimateOptions" :key="option" class="my-1" cols="auto">
                <v-btn
                  class="hover-effect text-h6 font-weight-bold"
                  color="black"
                  height="80"
                  variant="outlined"
                  width="60"
                  @click="castEstimate(option)"
                >
                  {{ option }}
                </v-btn>
              </v-col>
            </v-row>
          </section>

        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showNameDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h6">Provide your name to enter</v-card-title>
      <v-card-text>
        <v-text-field v-model="tempName" label="Display Name" outlined @keydown.enter="submitName" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="deep-purple-accent-4" variant="flat" @click="submitName">Submit</v-btn>
        <v-btn
          class="secondary"
          color="deep-purple-accent-4"
          text
          variant="outlined"
          @click="cancelName"
        >Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dark p {
  color: #ffffff;
}

.player-name {
  color: black;
}

.dark .player-name {
  color: white;
}

.player-estimate {
  color: black !important;
  font-weight: bold;
}

.dark .v-card-title {
  color: #ffffff;
}

.dark .v-card-text {
  color: #ffffff;
}

.v-container {
  background-color: #f9f9f9;
}

.dark .v-container {
  background-color: #121212;
}

.v-row,
.v-col,
.v-card {
  background-color: #f9f9f9;
}

.dark .v-row {
  background-color: #121212;
}

.dark .v-col {
  background-color: #121212;
}

.dark .v-card {
  background-color: #121212;
}

.dark .v-btn__content {
  color: #ffffff !important;
}

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

/* .flip-card-front {
  background-color: yellow;
} */
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

:deep(.contrast-fix.v-btn.v-btn--disabled) {
  opacity: 0.7 !important;
  border-color: #b39ddb !important; /* lichtere purple */
  color: #b39ddb !important;
}

.hover-effect {
  transition: transform 0.2s, background-color 0.2s, color 0.2s;
  background-color: white;
  color: black;
  border: 1px solid darkgray;
}

.hover-effect:hover {
  background-color: #424242; /* donkergrijs */
  color: white !important;
  transform: translateY(-5px);
}

.dark .secondary {
  color: white;
}
</style>
