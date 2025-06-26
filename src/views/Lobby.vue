<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'

  const router = useRouter()
  const username = ref('')
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
      await set(roomNameRef, `Room ${roomId}`)
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
    username.value = tempName.value.trim()
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
  <div class="lobby">
    <h1>Scrum Poker</h1>

    <label for="name">Your name displayed name:</label>
    <input v-model="username" name="name" placeholder="Display Name" />
    <button @click="createRoom">Nieuwe kamer maken</button>

    <hr />

    <label>Enter room number:</label>
    <input v-model="joinRoomId" placeholder="bv. 123456" />
    <button @click="enterRoom">Enter</button>
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

.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
}
.dialog {
  background: white; padding: 2rem; border-radius: 8px; width: 300px;
}
.actions {
  margin-top: 1rem; display: flex; justify-content: space-between;
}
</style>
