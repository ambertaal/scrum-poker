<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onMounted, ref, watch } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, get, onValue, set, update } from 'firebase/database'
  import { usePlayerStore, type UUID } from '@/stores/player'
  import { storeToRefs } from 'pinia'
  import PageLayout from '@/layouts/PageLayout.vue'
  import ConfettiCanvas from '@/components/ConfettiCanvas.vue'

  const playerStore = usePlayerStore()
  const { userId, username } = storeToRefs(playerStore)

  const route = useRoute()
  const router = useRouter()

  const roomId = (route.params as { roomId: string }).roomId

  const players = ref<{ id: UUID; name: string; estimate: string | null }[]>([])
  const roomName = ref<string>(roomId)
  const revealEstimates = ref<boolean>(false)
  const showNameDialog = ref<boolean>(false)
  const tempName = ref<string>('')
  const showDeleteDialog = ref<boolean>(false)
  const showShareDialog = ref<boolean>(false)
  const showConfetti = ref<boolean>(false)

  const estimateOptions = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?','☕']

  const hasEstimates = computed(() => players.value.some(p => p.estimate != null))

  const estimateCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    estimateOptions.forEach(option => { counts[option] = 0 })

    players.value.forEach(player => {
      if (player.estimate != null && counts[player.estimate] != null) {
        counts[player.estimate] += 1
      }
    })
    return counts
  })

  const openNameDialog = () => {
    tempName.value = ''
    showNameDialog.value = true
  }

  const submitName = async () => {
    if (!tempName.value.trim()) return
    playerStore.setUsername(tempName.value)
    showNameDialog.value = false

    const playerRef = dbRef(db, `rooms/${roomId}/players/${userId.value}`)
    await set(playerRef, { id: userId.value, name: username.value, estimate: null })

    await router.replace({ path: `/room/${roomId}`, query: { user: username.value } })
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
      const data = snapshot.val() as Record<string, { userId: UUID; name: string; estimate: string | null }> | null
      players.value = data
        ? Object.entries(data).map(([key, val]) => ({
          id: val.userId,
          name: val.name,
          estimate: val.estimate,
        }))
        : []
    })

    const roomNameRef = dbRef(db, `rooms/${roomId}/roomId`)
    onValue(roomNameRef, snapshot => roomName.value = snapshot.val())

    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)
    onValue(revealRef, snapshot => revealEstimates.value = snapshot.val() ?? false)
  })

  const castEstimate = async (estimate: string) => {
    if (!userId.value) {
      openNameDialog()
      return
    }
    const estimateRef = dbRef(db, `rooms/${roomId}/players/${userId.value}/estimate`)
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
    Object.keys(snapshot.val()).forEach(playerId => {
      updates[`rooms/${roomId}/players/${playerId}/estimate`] = null
    })
    await update(dbRef(db), updates)
  }

  const myChoice = computed<string>(() => {
    const me = players.value.find(p => p.name === username.value)
    return me?.estimate ?? ''
  })

  // Delete dialog logic
  const handleDelete = () => {
    showDeleteDialog.value = false
    confirmDelete()
  }

  const confirmDelete = async () => {
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    await set(playersRef, null)
    showDeleteDialog.value = false
  }

  const handleCancel = () => {
    showDeleteDialog.value = false
  }

  const onClickDelete = () => {
    showDeleteDialog.value = true
  }

  // Handle Share button click
  const onClickShare = () => {
    showShareDialog.value = true;
  }

  const handleShareDone = () => {
    showShareDialog.value = false;
  }

  // Confetti logic: show when revealed + all estimates match
  watch([players, revealEstimates], ([newPlayers, shouldRevealEstimates]) => {
    if (!shouldRevealEstimates) {
      showConfetti.value = false;
      return;
    }

    const estimates = newPlayers
      .map(player => player.estimate)
      .filter((estimate): estimate is string => estimate != null); // laat null/undefined weg

    const hasAtLeastTwoPlayers = newPlayers.length >= 2;
    const everyoneHasEstimated = estimates.length === newPlayers.length;
    const uniqueEstimates = new Set(estimates);

    showConfetti.value = hasAtLeastTwoPlayers && everyoneHasEstimated && uniqueEstimates.size === 1;
  });

  // Hide confetti after 4 seconds
  watch(showConfetti, isConfettiVisible => {
    if (isConfettiVisible) {
      setTimeout(() => showConfetti.value = false, 4000);
    }
  });
</script>

<template>
  <div class="main-content">
    <ConfettiCanvas v-if="showConfetti" />
    <PageLayout>
      <v-card class="pa-10 pa-sm-8 pa-md-6 pa-lg-4 estimation-cards" elevation="0">
        <v-card-title class="text-h6">
          <div class="text-center">
            <h3>Room: {{ roomName }}</h3>
            <v-btn
              prepend-icon="mdi-share-variant"
              variant="text"
              @click="onClickShare"
            >
              <template #prepend>
                <v-icon color="share-icon" />
              </template>
              <span>Share room</span>
            </v-btn>
            <!-- <v-tooltip location="top" text="Delete everyone in this room">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-delete" variant="text" @click="onClickDelete" />
              </template>
            </v-tooltip> -->
            <v-btn
              prepend-icon="mdi-delete"
              variant="text"
              @click="onClickDelete"
            >
              <template #prepend>
                <v-icon color="delete-icon" />
              </template>
              <span>Delete room</span>
            </v-btn>
          </div>
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
              class="secondary-btn"
              :disabled="!hasEstimates"
              variant="outlined"
              @click="resetEstimates"
            >Delete estimates</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn class="primary-btn" :disabled="!hasEstimates" @click="toggleRevealEstimates">
              {{ revealEstimates ? 'Hide Cards' : 'Reveal Cards' }}
            </v-btn>
          </v-col>
        </v-row>

        <EstimateOptions
          :counts="estimateCounts"
          :my-choice="myChoice"
          :options="estimateOptions"
          :reveal="revealEstimates"
          @select="castEstimate"
        />
      </v-card>

      <Dialog
        v-model="showNameDialog"
        v-model:name="tempName"
        cancel-text="Cancel"
        confirm-text="Submit"
        input-label="Display Name"
        message=""
        persistent
        title="Provide your name to enter"
        variant="nameDialog"
        @cancel="cancelName"
        @submit="submitName"
        @update:name="(newPlayerName: string) => tempName = newPlayerName"
      />

      <Dialog
        v-model="showDeleteDialog"
        cancel-text="Cancel"
        confirm-text="Delete"
        message="Are you sure you want to delete all participants in the room?"
        title="Clear room"
        variant="deleteDialog"
        @cancel="handleCancel"
        @submit="handleDelete"
      />

      <Dialog
        v-model="showShareDialog"
        confirm-text="Done"
        hide-cancel
        message="Invite people to join the room."
        :room-id="roomId"
        title="Share room"
        variant="shareDialog"
        @submit="handleShareDone"
      />
    </PageLayout>
  </div>
</template>

<style scoped>
.dark .text-h6 {
  color: #ffffff;
}

.dark p {
  color: #ffffff;
}

.share-icon {
  color: #2A1449;
}

.dark .share-icon {
  color: white;
}

.delete-icon {
  color: #2A1449;
}

.dark .delete-icon {
  color: white;
}
</style>
