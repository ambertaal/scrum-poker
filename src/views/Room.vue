<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'

  const playerStore = usePlayerStore()
  const { username } = storeToRefs(playerStore)

  // Router & route
  const route = useRoute()
  const router = useRouter()

  // Route param & query
  const roomId = (route.params as { roomId: string }).roomId

  // Reactive state
  const players = ref<{ name: string; estimate: string | null }[]>([])
  const roomName = ref<string>(roomId)
  const revealEstimates = ref<boolean>(false)
  const showNameDialog = ref<boolean>(false)
  const tempName = ref<string>('')

  // Available estimations
  const estimateOptions = ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100']

  // Computed: bestaan er schattingen?
  const hasEstimates = computed(() => players.value.some(p => p.estimate != null))

  // Open name dialog
  const openNameDialog = () => {
    tempName.value = ''
    showNameDialog.value = true
  }

  // Submit name and replace URL
  const submitName = async () => {
    if (!tempName.value.trim()) return

    playerStore.setUsername(tempName.value)
    showNameDialog.value = false

    // Add player to Firebase
    const playerRef = dbRef(db, `rooms/${roomId}/players/${username.value}`)
    await set(playerRef, { name: username.value, estimate: null })


    // Replace URL so the future estimations get this name
    router.replace({
      path: `/room/${roomId}`,
      query: { user: username.value },
    })
  }

  // Cancel name dialog
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

    // Get people in room
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    onValue(playersRef, snapshot => {
      const data = snapshot.val() as Record<string, { name: string; estimate: string | null }> | null
      if (data) {
        players.value = Object.entries(data).map(([key, val]) => ({
          name: key,
          estimate: val.estimate,
        }))
      } else {
        players.value = []
      }
    })

    // RoomName
    const roomNameRef = dbRef(db, `rooms/${roomId}/name`)
    onValue(roomNameRef, snapshot => {
      roomName.value = snapshot.val()
    })

    // Reveal toggle
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    onValue(revealRef, snapshot => {
      revealEstimates.value = snapshot.val() ?? false
    })
  })

  const castEstimate = async (estimate: string) => {
    if (!username.value) {
      openNameDialog()
      return
    }
    try {
      const estimateRef = dbRef(db, `rooms/${roomId}/players/${username.value}/estimate`)
      await set(estimateRef, estimate)
    } catch (err) {
      console.error('Fout bij uitbrengen schatting:', err)
    }
  }

  // Reveal toggle action
  const toggleRevealEstimates = async () => {
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    await set(revealRef, !revealEstimates.value)
  }

  // Reset all estimations
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
  <div class="page-layout">
    <div class="darkmode-toggle">
      <DarkModeToggle />
    </div>

    <div class="room">
      <p>Room: {{ roomName }}</p>

      <section class="results-section">
        <section class="cards-section">
          <div v-for="(player, index) in players" :key="index" class="card" :class="{ flipped: revealEstimates }">
            <div class="card-inner">
              <div v-if="!player.estimate" class="card-front-empty">
              </div>
              <div v-if="player.estimate" class="card-front">
              </div>
              <div class="card-back">
                <!-- Estimation number -->
                {{ player.estimate }}
              </div>
            </div>
            <div class="card-name">{{ player.name }}</div>
          </div>
        </section>

        <div class="button-bar">
          <button class="secondary-button" :disabled="!hasEstimates" @click="resetEstimates">Delete estimates</button>
          <button class="primary-button" @click="toggleRevealEstimates">
            {{ revealEstimates ? 'Hide Cards' : 'Reveal Cards' }}
          </button>
        </div>
      </section>

      <section class="estimate-section">
        <div class="card-buttons">
          <p>Pick your card &#128073;</p>
          <button v-for="option in estimateOptions" :key="option" class="card-button" @click="castEstimate(option)">
            {{ option }}
          </button>
        </div>
      </section>

    </div>
  </div>

  <div v-if="showNameDialog" class="overlay">
    <div class="dialog">
      <h3>Provide your name to enter</h3>
      <input v-model="tempName" placeholder="Display Name" />
      <div class="actions">
        <button @click="submitName">Submit</button>
        <button @click="cancelName">Cancel</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.page-layout {
  position: relative;
  min-height: 100vh;
  padding: 1rem;
}

.darkmode-toggle {
  width: 60px;
  height: 34px;
  position: absolute;
  top: 4rem;
  right: 10rem;
  z-index: 10;
}

.room {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  margin: 2rem auto;
  font-family: sans-serif;
}

.darkmode-toggle {
  width: 60px;
  height: 34px;
}

button {
  margin: 2px;
  padding: 0.5rem;
  font-weight: bold;
  color: white;
  background-color:cadetblue;
}

.button-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
}

.primary-button {
  background-color: lightseagreen;
  color: white;
  border-radius: 5%;
  width: 10rem;
}

.secondary-button {
  background-color:lightgray;
  color:black;
  border-radius: 5%;
  width: 10rem;
}

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color:lightgray;
  color: darkgray;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header {
  display: block;
}

.player-list {
  list-style: none;
  padding: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}

label {
  width: 100%;
  display: block;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid darkgray;
}

.dark input {
  background-color: #222;
  color: white;
  border-color: #888;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.cards-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem;
}

.card {
  width: 100px;
  perspective: 1000px;
}


.card-inner {
  position: relative;
  width: 100%;
  height: 140px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 8px;
}

.card-front-empty {
  background-color: white;
  color: black;
  border: 1px solid grey;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.card-front {
  background-color: cadetblue;
  color: white;
}

.card-back {
  background-color: white;
  color: black;
  border: 1px solid grey;
  transform: rotateY(180deg);
}

.estimations {
  display: flex;
  margin: 2rem;
}

.estimate-section {
  margin-top: 3rem;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-button {
  color: black;
  background-color: white;
  border-style: solid;
  border-color: darkgray;
  height: 5rem;
  width: 3.5rem;
  border-radius: 10%;
}

.card-button:hover,
.card-button:focus {
  box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
  transform: translateY(-0.25em);
  background-color: darkgray;
  color: white;
}

.card-name {
  margin: 1rem 0 0 0;
}
</style>
