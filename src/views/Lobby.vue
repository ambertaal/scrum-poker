<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'

  const playerStore = usePlayerStore()
  const { username } = storeToRefs(playerStore)

  const router = useRouter()
  const joinRoomId = ref('')

  // temporary saves where the user wants to navigate to
  const pendingRoomId = ref<string | null>(null)
  // show the DisplayName dialog
  const showNameDialog = ref(false)
  // buffer for the new name in the DisplayName dialog
  const tempName = ref('')

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
      // Save person
      await set(playerRef, { name: username.value, estimate: null })
      // Save roomName
      await set(roomNameRef, roomId)
      // Set revealEstimates by default to false
      await set(revealRef, false)

      // Navigate to room
      router.push(`/room/${roomId}?user=${username.value}`)
    } catch (error) {
      console.error('❌ Fout bij testkamer aanmaken:', error)
      alert('Er ging iets mis bij het aanmaken van de kamer.')
    }
  }

  const enterRoom = () => {
    if (!joinRoomId.value.trim()) {
      alert('Enter Room Number please')
      return
    }
    pendingRoomId.value = joinRoomId.value
    if (!username.value.trim()) {
      showNameDialog.value = true
    } else {
      router.push(`/room/${joinRoomId.value}?user=${username.value}`)
    }
  }

  const submitName = () => {
    if (!tempName.value.trim()) return
    playerStore.setUsername(tempName.value)
    showNameDialog.value = false
    router.push(`/room/${pendingRoomId.value}?user=${username.value}`)
  }

  const cancelName = () => {
    showNameDialog.value = false
    // enter the room but without ?user=
    router.push(`/room/${pendingRoomId.value}`)
  }
</script>

<template>
  <div class="page-layout">
    <div class="darkmode-toggle">
      <DarkModeToggle />
    </div>

    <div class="lobby">

      <h1>Start a new Planning Poker session</h1>

      <label for="name">Display name:</label>
      <input v-model="username" name="name" placeholder="Display Name" />
      <button @click="createRoom">Create a new room</button>

      <hr />
      <h2>Already have a room?</h2>
      <label>Room number:</label>
      <input v-model="joinRoomId" placeholder="bv. 123456" />
      <button @click="enterRoom">Enter</button>
    </div>
  </div>
  <!-- Name dialog -->
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

.lobby {
  max-width: 400px;
  width: 100%;
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
  border: 1px solid darkgray;
}

.dark input {
  background-color: #222;
  color: white;
  border-color: #888;
}

button {
  padding: 0.5rem;
  font-weight: bold;
  color: white;
  background-color: blue;
}

.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
}
.dialog {
  background: var(--dialog-background, white);
  color: inherit;
  padding: 2rem; border-radius: 8px; width: 300px;
}
.actions {
  margin-top: 1rem; display: flex; justify-content: space-between;
}

</style>
