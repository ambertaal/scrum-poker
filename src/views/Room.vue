<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'

  // Router & route
  const route = useRoute()
  const router = useRouter()

  // Route param & query
  const roomId = (route.params as { roomId: string }).roomId
  const username = ref<string>((route.query.user as string) || '')

  // Reactive state
  const players = ref<{ name: string; estimate: string | null }[]>([])
  const roomName = ref<string>(roomId)
  const revealEstimates = ref<boolean>(false)
  const showNameDialog = ref<boolean>(false)
  const tempName = ref<string>('')

  // Available estimations
  const estimateOptions = ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100']

  // Open name dialog
  const openNameDialog = () => {
    tempName.value = ''
    showNameDialog.value = true
  }

  // Submit name and replace URL
  const submitName = () => {
    if (!tempName.value.trim()) return
    username.value = tempName.value.trim()
    showNameDialog.value = false
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
  <div class="room">
    <h1>{{ roomName }}</h1>

    <section class="estimate-section">
      <h2>Provide an effort estimate - choose one of the cards</h2>
      <p>Each team member should estimate the complexity of the task (user story) to be completed.</p>
      <div class="buttons">
        <button v-for="option in estimateOptions" :key="option" @click="castEstimate(option)">
          {{ option }}
        </button>
      </div>
    </section>

    <h2>Reveal the cards</h2>
    <p>Once everyone has submitted their effort estimates, the organizer reveals the cards.</p>

    <section class="results-section">
      <div class="button-bar">
        <div class="header">
          <h2>Name:</h2>
        </div>
        <div class="buttons">
          <button @click="resetEstimates">Delete estimates</button>
          <button @click="toggleRevealEstimates">
            {{ revealEstimates ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>

      <ul class="player-list">
        <li v-for="(player, index) in players" :key="index">
          {{ player.name }} {{ revealEstimates ? (player.estimate ?? '-') : '🔒 verborgen' }}
        </li>
      </ul>
    </section>
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
.room {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
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
.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
