<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'
  import PageLayout from '@/layouts/PageLayout.vue'

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
  const showDeleteDialog = ref(false)

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

  const onClickDelete = () => {
    showDeleteDialog.value = true
  }

  const confirmDelete = async () => {
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    await set(playersRef, null)
    showDeleteDialog.value = false
  }

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
  <PageLayout>
    <v-card class="pa-4 estimation-cards" elevation="0">

      <v-card-title class="text-h6">
        Room: {{ roomName }}
        <v-tooltip location="top" text="Verwijderen iedereen in deze kamer">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-delete" variant="plain" @click="onClickDelete"/>
          </template>
        </v-tooltip>
      </v-card-title>

      <v-row align="center" class="my-4 ga-4" justify="center" no-gutters>
        <PlayerCard
          v-for="(player, index) in players"
          :key="index"
          :estimate="player.estimate"
          :name="player.name"
          :reveal="revealEstimates"
        />
      </v-row>

      <v-row class="my-4" justify="center">
        <v-col cols="auto">
          <v-btn
            class="contrast-fix"
            color="deep-purple-accent-4"
            :disabled="!hasEstimates"
            variant="outlined"
            @click="resetEstimates"
          >Delete estimates</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="deep-purple-accent-4" @click="toggleRevealEstimates">
            {{ revealEstimates ? 'Hide Cards' : 'Reveal Cards' }}
          </v-btn>
        </v-col>
      </v-row>

      <EstimateOptions :options="estimateOptions" @select="castEstimate" />
    </v-card>
  </PageLayout>

  <NameDialog
    v-model="showNameDialog"
    :name="tempName"
    @cancel="cancelName"
    @submit="submitName"
    @update:name="val => tempName = val"
  />

  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Clear room</v-card-title>
      <v-card-text>Are you sure you want to delete all participants in the room?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
        <v-btn color="red" variant="text" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dark .text-h6 {
  color: #ffffff;
}

.dark p {
  color: #ffffff;
}

.estimation-cards {
  background-color: #f9f9f9;
}

.dark .estimation-cards {
  background-color: #121212;
}
</style>
