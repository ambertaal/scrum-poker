<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'
  import { generateRoomId } from '@/utils/generateRoomid'
  import PageLayout from '@/layouts/PageLayout.vue'

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
  <PageLayout>
    <CreateRoomForm
      :name="username"
      @submit="createRoom"
      @update:name="newName => username = newName"
    />

    <DividerWithLabel>or</DividerWithLabel>

    <JoinRoomForm
      :id="joinRoomId"
      @submit="enterRoom"
      @update:id="newRoomId => joinRoomId = newRoomId"
    />

    <NameDialog
      v-model="showNameDialog"
      :name="tempName"
      @cancel="cancelName"
      @submit="submitName"
      @update:name="newTempName => tempName = newTempName"
    />
  </PageLayout>
</template>
