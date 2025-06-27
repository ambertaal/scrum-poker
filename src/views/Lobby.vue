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
  <Header />
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col
        class="text-center"
        cols="12"
        lg="4"
        md="6"
        sm="8"
      >

        <!-- Icon -->
        <v-icon class="mb-4" size="64">mdi-cards-playing-outline</v-icon>

        <!-- Titel -->
        <h2 class="font-weight-bold mb-6">Create a new room</h2>

        <!-- Display Name Input -->
        <v-text-field
          v-model="username"
          class="mb-4 name-input"
          dense
          label="Display Name"
          outlined
          placeholder="e.g. Dreplay Room"
          @keydown.enter="createRoom"
        />

        <v-btn block color="deep-purple-accent-4" large @click="createRoom">
          Create Room
        </v-btn>

        <v-divider class="my-6">
          <span class="text-caption">or</span>
        </v-divider>

        <!-- Join Existing Room Section -->
        <h3 class="text-subtitle-1 font-weight-bold mb-2">Enter existing room</h3>

        <v-text-field
          v-model="joinRoomId"
          class="mb-4 roomnumber-input"
          dense
          label="Room number"
          outlined
          placeholder="e.g. 123456"
          @keydown.enter="enterRoom"
        />

        <v-btn block color="deep-purple-accent-4" variant="outlined" @click="enterRoom">
          Join Room
        </v-btn>

        <!-- Name Dialog -->
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

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.125rem;
}

h2,
h3 {
  color: #1a1a1a;
}

.dark h2,
.dark h3 {
  color: #ffffff;
}

.v-container {
  background-color: #f9f9f9;
}

.dark .v-container {
  background-color: #121212;
}

.v-icon {
  color: #424242;
}

.dark .v-icon {
  color: #ffffff;
}

.dark .name-input,
.dark .roomnumber-input {
  color: #ffffff;
}

.v-dialog .v-card {
  border-radius: 12px;
}

.dark .v-card {
  background-color: #121212;
}

.dark .v-card-title {
  color: #ffffff;
}

.dark .v-card-text {
  color: #ffffff;
}
</style>
