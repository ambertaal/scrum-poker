<script setup lang="ts">
import { ref as dbRef, set } from "firebase/database";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { ref } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";
import { generateRoomId } from "@/utils/generateRoomid";
import JoinRoomForm from "@/components/JoinRoomForm.vue";
import PageLayout from "@/layouts/PageLayout.vue";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Plus } from "lucide-vue-next";

const playerStore = usePlayerStore();
const { userId, username } = storeToRefs(playerStore);

const router = useRouter();
const joinRoomId = ref("");

// temporary saves where the user wants to navigate to
const pendingRoomId = ref<string | null>(null);

const joinDialog = ref(false);
const displayNameField = ref();

const focusName = () => {
  requestAnimationFrame(() => displayNameField.value?.focus?.());
};

const createRoom = async () => {
  if (!username.value) {
    alert("Enter Display Name please");
    focusName();
    return;
  }

  const roomId = generateRoomId();
  const playerRef = dbRef(db, `rooms/${roomId}/players/${userId.value}`);
  const roomNameRef = dbRef(db, `rooms/${roomId}/roomId`);
  const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`);

  try {
    // Save person
    await set(playerRef, {
      id: userId.value,
      name: username.value,
      estimate: null
    });
    // Save roomName
    await set(roomNameRef, roomId);
    // Set revealEstimates by default to false
    await set(revealRef, false);
    // Navigate to room
    await router.push(`/room/${roomId}?user=${username.value}`);
  } catch (e) {
    console.error("❌ Error creating room:", e);
    alert("Something went wrong while creating the room.");
  }
};

const enterRoom = async () => {
  if (!joinRoomId.value.trim()) {
    alert("Enter Room Number please");
    return;
  }
  pendingRoomId.value = joinRoomId.value;

  const playerRef = dbRef(
    db,
    `rooms/${joinRoomId.value}/players/${userId.value}`
  );
  await set(playerRef, {
    id: userId.value,
    name: username.value,
    estimate: null
  });

  await router.push(`/room/${joinRoomId.value}?user=${username.value}`);
};
</script>

<template>
  <div class="main-content">
    <PageLayout>
      <section
        id="hero"
        class="container mx-auto grid min-h-[40vh] place-items-center px-4 py-12"
      >
        <div class="w-full max-w-[428px] text-center">
          <div class="w-full">
            <h2
              class="mt-3 max-w-[414px] text-[#2A1449] uppercase text-[40px] dark:text-white"
            >
              Free Online
            </h2>
            <h2 class="mt-3 text-[40px] font-bold uppercase">Scrum Poker tool</h2>
            <p
              class="mt-3 max-w-[414px] text-lg text-[#2A1449] dark:text-white"
            >
              Estimate stories with a clean, distraction‑free interface. Create
              a room in seconds, invite your team, and vote in real time.
            </p>

            <div
              id="get-started"
              class="mx-auto mt-8 flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-3xl bg-[#EDE9F2] p-6 sm:p-8 dark:bg-[#1F0B3D]"
            >
              <div class="mb-4">
                <Label
                  class="mb-3 pt-16 text-base font-bold text-[#2A1449] dark:text-white"
                  for="displayName"
                >
                  What would you prefer to be called?
                </Label>
                <Input
                  v-model="username"
                  id="displayName"
                  ref="displayNameField"
                  class="name-input mx-auto mt-2 w-full rounded-lg bg-white text-left [:placeholder-shown]:text-center placeholder:text-center""
                  placeholder="Enter a display name"
                />
              </div>

              <div
                class="flex flex-col items-center justify-center gap-3 pb-16"
              >
                <Button
                  class="inline-flex h-11 items-center justify-center rounded-full !bg-[#EC7F31] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-white uppercase hover:!bg-[#CE2935] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:focus-visible:outline-white"
                  :disabled="!username.trim()"
                  @click="createRoom"
                >
                  <Plus aria-hidden="true" class="mr-2 h-4 w-4" />
                  Create a room
                </Button>

                <div class=" text-lg text-[#2A1449] dark:text-white">or</div>

                <Dialog v-model:open="joinDialog">
                  <DialogTrigger as-child>
                    <Button
                      class="inline-flex h-11 items-center justify-center rounded-full !border-2 !border-[#2A1449] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-[#492D7B] uppercase hover:!bg-[#492D7B] hover:!text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:!border-2 dark:!border-white dark:!bg-transparent dark:!text-white dark:focus-visible:outline-white dark:disabled:!border-2 dark:disabled:!border-white"
                      :disabled="!username.trim()"
                      variant="outline"
                    >
                      Join room
                    </Button>
                  </DialogTrigger>

                  <DialogContent class="sm:max-w-[420px] rounded-2xl bg-[#2A1449] !p-6 sm:p-8 text-white">
                    <DialogHeader class="mt-4">
                      <DialogTitle class="text-[#2A1449] dark:text-white">Join room</DialogTitle>
                    </DialogHeader>

                    <JoinRoomForm v-model:id="joinRoomId" @submit="enterRoom" />
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
