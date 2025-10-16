<script setup lang="ts">
  import { ref as dbRef, set } from 'firebase/database'
  import { useRouter } from 'vue-router'
  import { db } from '@/firebase'
  import { ref } from 'vue'
  import { usePlayerStore } from '@/stores/player'
  import { storeToRefs } from 'pinia'
  import { generateRoomId } from '@/utils/generateRoomid'
  import JoinRoomForm from '@/components/JoinRoomForm.vue'
  import PageLayout from '@/layouts/PageLayout.vue'

  // shadcn components
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'

  import { Plus } from 'lucide-vue-next'

  const playerStore = usePlayerStore()
  const { userId, username } = storeToRefs(playerStore)

  const router = useRouter()
  const joinRoomId = ref('')

  // temporary saves where the user wants to navigate to
  const pendingRoomId = ref<string | null>(null)

  const joinDialog = ref(false)
  const displayNameField = ref()

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
    const playerRef = dbRef(db, `rooms/${roomId}/players/${userId.value}`)
    const roomNameRef = dbRef(db, `rooms/${roomId}/roomId`)
    const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`)

    try {
      // Save person
      await set(playerRef, { id: userId.value, name: username.value, estimate: null })
      // Save roomName
      await set(roomNameRef, roomId)
      // Set revealEstimates by default to false
      await set(revealRef, false)
      // Navigate to room
      await router.push(`/room/${roomId}?user=${username.value}`)
    } catch (e) {
      console.error('❌ Error creating room:', e)
      alert('Something went wrong while creating the room.')
    }
  }

  const enterRoom = async () => {
    if (!joinRoomId.value.trim()) {
      alert('Enter Room Number please')
      return
    }
    pendingRoomId.value = joinRoomId.value

    const playerRef = dbRef(db, `rooms/${joinRoomId.value}/players/${userId.value}`)
    await set(playerRef, { id: userId.value, name: username.value, estimate: null })

    await router.push(`/room/${joinRoomId.value}?user=${username.value}`)
  }

</script>

<template>
  <div class="main-content">
    <PageLayout>
      <section id="hero" class="container mx-auto px-4 py-12 min-h-[40vh] grid place-items-center">
        <div class="w-full max-w-2xl text-center">
          <div class="w-full md:w-1/2 md:pr-8">
            <h2 class="text-[#2A1449] mt-3 dark:text-white">Free Online Scrum Poker tool</h2>
            <p class="text-[#2A1449] dark:text-white mt-3">
              Estimate stories with a clean, distraction‑free interface. Create a room in seconds, invite your team, and vote in real time.
            </p>

            <div id="get-started" class="mt-8 bg-[#EDE9F2] dark:bg-[#1F0B3D] rounded-3xl p-6 sm:p-8 mx-auto w-full max-w-md flex flex-col justify-center items-center min-h-[220px] gap-4">
              <div class="mb-4">
                <Label class="text-[#2A1449] dark:text-white pt-16" for="displayName">What would you prefer to be called?</Label>
                <Input
                  id="displayName"
                  ref="displayNameField"
                  v-model="username"
                  class="name-input mt-2 bg-white rounded-lg w-full mx-auto"
                  placeholder="Enter a display name"
                />
              </div>

              <div class="flex flex-col items-center justify-center gap-3 pb-16">
                <Button
                  class="
                    h-11 px-6 py-3 rounded-full
                    !bg-[#EC7F31] hover:!bg-[#CE2935]
                    text-white text-[14px] leading-[18px] font-bold uppercase tracking-[0.1em]
                    inline-flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                    focus-visible:outline focus-visible:outline-offset-2
                    focus-visible:outline-blue-600 dark:focus-visible:outline-white
                  "
                  :disabled="!username.trim()"
                  @click="createRoom"
                >
                  <Plus aria-hidden="true" class="mr-2 h-4 w-4" />
                  Create a room
                </Button>

                <div class="text-[#2A1449] dark:text-white">or</div>

                <Dialog v-model:open="joinDialog">
                  <DialogTrigger as-child>
                    <Button
                      class="h-11 px-6 py-3 rounded-full hover:!bg-[#492D7B]
                     !border-2 !border-[#2A1449]
                    text-[#492D7B] text-[14px] hover:!text-white leading-[18px] font-bold uppercase tracking-[0.1em]
                    inline-flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                    focus-visible:outline focus-visible:outline-offset-2
                    focus-visible:outline-blue-600 dark:focus-visible:outline-white dark:!bg-transparent dark:disabled:!border-2 dark:disabled:!border-white dark:!text-white dark:!border-2 dark:!border-white"
                      :disabled="!username.trim()"
                      variant="outline"
                    >
                      Join room
                    </Button>
                  </DialogTrigger>

                  <DialogContent class="sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle>Join room</DialogTitle>
                    </DialogHeader>

                    <JoinRoomForm
                      v-model:id="joinRoomId"
                      @submit="enterRoom"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  </div>
</template>

<!-- <style scoped>
.display-2 {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.max-w-400{ max-width: 400px; }

:deep(a.text-white) {
  text-decoration: none;
}

:deep(a.text-white:hover) {
  text-decoration: none;
}
</style> -->
