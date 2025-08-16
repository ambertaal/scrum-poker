<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'
  import { generateRoomId } from '@/utils/generateRoomid'
  import JoinRoomForm from '@/components/JoinRoomForm.vue'

  const playerStore = usePlayerStore()
  const { username } = storeToRefs(playerStore)

  const router = useRouter()
  const joinRoomId = ref('')

  // temporary saves where the user wants to navigate to
  const pendingRoomId = ref<string | null>(null)
  // show the DisplayName dialog
  const showNameDialog = ref(false)

  const joinDialog = ref(false)
  const displayNameField = ref()

  const featureImg = ref('../public/landscape-placeholder.svg')

  const focusName = () => {
    requestAnimationFrame(() => displayNameField.value?.focus?.())
  }

  const createRoom = async () => {
    if (!username.value) {
      alert('Enter Display Name please')
      focusName()
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
    } catch (e) {
      console.error('❌ Error creating room:', e)
      alert('Something went wrong while creating the room.')
    }
  }

  const enterRoom = () => {
    if (!joinRoomId.value.trim()) {
      alert('Enter Room Number please')
      return
    }
    pendingRoomId.value = joinRoomId.value
    if (!username.value?.trim()) {
      showNameDialog.value = true
    } else {
      router.push(`/room/${joinRoomId.value}?user=${username.value}`)
    }
  }
</script>

<template>
  <div class="main-content">
    <HeaderV2 />

    <!-- Hero -->
    <v-container id="hero" class="mt-8 mt-sm-12">
      <v-row class="align-center" no-gutters>
        <v-col class="pr-md-8" cols="12" md="6">
          <div class="pill">Simple but effective</div>
          <h2 class="display-2 mt-3">Free Online Scrum Poker tool</h2>
          <p class="text-body-1 text-medium-emphasis mt-3">
            Estimate stories with a clean, distraction‑free interface. Create a room in seconds, invite your team, and vote in real time.
          </p>

          <!-- Inline forms: display name + actions -->
          <div id="get-started" class="mt-6">
            <v-text-field
              ref="displayNameField"
              v-model="username"
              class="mb-3 max-w-400"
              density="comfortable"
              hide-details
              label="Display Name"
              variant="outlined"
            />
            <div class="d-flex flex-wrap ga-3">
              <v-btn
                class="gradient-btn"
                :disabled="!username.trim()"
                rounded="pill"
                size="large"
                @click="createRoom"
              >
                Create a room
                <v-icon end icon="mdi-arrow-right" />
              </v-btn>

              <v-dialog v-model="joinDialog" max-width="420">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="!username.trim()"
                    rounded="pill"
                    size="large"
                    variant="outlined"
                  >
                    Join room
                  </v-btn>
                </template>

                <v-card>
                  <v-card-text>
                    <JoinRoomForm
                      v-model:id="joinRoomId"
                      @submit="enterRoom"
                    />
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </v-col>

        <v-col class="mt-6 mt-md-0" cols="12" md="6">
          <v-img
            alt="Real-time estimation"
            class="rounded-lg elevation-4"
            cover
            height="320"
            :src="featureImg"
          />
        </v-col>
      </v-row>
    </v-container>

    <ImageContent
      description="Use our user-friendly interface to create rooms, invite teammates, and estimate with Fibonacci"  
      :image="featureImg"
      title="Real-Time voting and estimation"
    />
    <Footer />
  </div>
</template>

<style scoped>
.main-content {
  background-color: #f9f9f9;
}

.dark .main-content {
  background-color: #121212;
}

.dark h2 {
  color: #ffffff;
}

.top-gradient {
  height: 4px;
  background: linear-gradient(90deg, #f43f5e, #a855f7, #f59e0b);
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 10;
}
.logo-chip {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.25);
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  border: 1px solid rgba(168, 85, 247, 0.35);
  background: rgba(250, 245, 255, 0.8);
}
.display-2 {
  font-weight: 800;
  letter-spacing: -0.02em;
}
.glass {
  backdrop-filter: blur(6px);
  background: color-mix(in oklab, var(--v-theme-surface) 80%, transparent);
}
.soft-surface {
  background: color-mix(in oklab, var(--v-theme-surface) 90%, var(--v-theme-on-surface) 5%);
}
.mini-accent {
  width: 96px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.gradient-btn {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
  color: white !important;
}
.gradient-slab {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.footer-gradient {
  background: linear-gradient(40deg,#4c1f82,#8c1d82 14%,#cf022b 50%,#ffb15c) !important;
}
.max-w-400{ max-width: 400px; }

:deep(a.text-white) {
  text-decoration: none;
}

:deep(a.text-white:hover) {
  text-decoration: none;
}
</style>
