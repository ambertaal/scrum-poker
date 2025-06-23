<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'

  const router = useRouter()
  const username = ref('')

  const generateRoomId = (): string => {
    const id = Math.floor(100000 + Math.random() * 900000)
    return id.toString()
  }

  const createRoom = async () => {
    if (!username.value) {
      alert('Enter Display Name please')
      return
    }

    const roomId = generateRoomId()
    const playerRef = dbRef(db, `rooms/${roomId}/players/${username.value}`)
    const roomNameRef = dbRef(db, `rooms/${roomId}/name`)
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)

    try {
      // Sla speler op
      await set(playerRef, { name: username.value, estimate: null })
      // Sla kamernaam op
      await set(roomNameRef, `Room ${roomId}`)
      // Zet standaard revealEstimates op false
      await set(revealRef, false)

      // Navigeer naar room
      router.push(`/room/${roomId}?user=${username.value}`)
    } catch (error) {
      console.error('❌ Fout bij testkamer aanmaken:', error)
      alert('Er ging iets mis bij het aanmaken van de kamer.')
    }
  }
</script>

<template>
  <div class="lobby">
    <h1>Scrum Poker</h1>
    <label for="name">Your name displayed name:</label>
    <input v-model="username" name="name" placeholder="Display Name" />
    <button @click="createRoom">Nieuwe kamer maken</button>
  </div>
</template>

<style scoped>
.lobby {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  width: 100%;
  display: block;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
  border-style: solid;
  border-width: 1px;
  border-color: darkgray;
}
button {
  padding: 0.5rem;
  font-weight: bold;
  color: white;
  background-color: blue;
}
</style>
