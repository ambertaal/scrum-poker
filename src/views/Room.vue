<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'

  const route = useRoute()
  const roomId = (route.params as { roomId: string }).roomId
  const username = route.query.user as string

  const players = ref<{ name: string; estimate: string | null }[]>([])
  const roomName = ref('')
  const revealEstimates = ref(false)

  onMounted(() => {
    // Haal de spelers op uit de kamer
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    onValue(playersRef, snapshot => {
      const data = snapshot.val()
      players.value = data ? Object.values(data) : []
    })

    // Haal de kamernaam op
    const roomNameRef = dbRef(db, `rooms/${roomId}/name`)
    onValue(roomNameRef, snapshot => {
      roomName.value = snapshot.val()
    })

    // Zet standaard revealEstimates op false
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    onValue(revealRef, snapshot => {
      revealEstimates.value = snapshot.val() ?? false
    })
  })

  const estimateOptions = ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100']

  const castEstimate = async (estimate: string) => {
    console.log(estimate)
    const estimateRef = dbRef(db, `rooms/${roomId}/players/${username}/estimate`)
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
  <div class="room">
    <h1>{{ roomName }}</h1>

    <div class="estimate-buttons">
      <h2>Provide an effort estimate - choose one of the cards</h2>
      <p>Each team member should estimate the complexity of the task (user story) to be completed.</p>
      <button v-for="option in estimateOptions" :key="option" @click="castEstimate(option)">
        {{ option }}
      </button>
    </div>
    <h2>Reveal the cards</h2>
    <p>Once everyone has submitted their effort estimates, the organizer reveals the cards.</p>

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
    <ul>
      <li v-for="(player, index) in players" :key="index">
        {{ player.name }} {{ revealEstimates ? (player.estimate ?? '-') : '🔒 verborgen' }}
      </li>
    </ul>
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

.button-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
}

.header {
  display: block;
}
</style>
