<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { db } from "@/firebase";
import { ref as dbRef, get, onValue, set, update } from "firebase/database";
import { usePlayerStore, type UUID } from "@/stores/player";
import { storeToRefs } from "pinia";
import PageLayout from "@/layouts/PageLayout.vue";
import ConfettiCanvas from "@/components/ConfettiCanvas.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import {
  ESTIMATE_OPTIONS,
  type EstimateOption
} from "@/types/estimates";
import { mapRoomPlayers, type PlayerEstimate } from "@/utils/getRoomPlayers";
import {
  getEstimateCounts,
  shouldShowConfetti
} from "@/utils/getEstimateCounts";
import { savePlayer, setPlayerEstimate } from "@/api/playerService";
import {
  addPlayerToRoom,
  resetRoomEstimates,
  setRevealEstimates,
  deleteRoom
} from "@/api/roomService";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-vue-next";
import { Trash2 } from "lucide-vue-next";

const playerStore = usePlayerStore();
const { userId, username } = storeToRefs(playerStore);

const route = useRoute();
const router = useRouter();

const roomId = (route.params as { roomId: string }).roomId;

const roomPlayerIds = ref<UUID[]>([]);
const allPlayers = ref<
  Record<string, { id: UUID; name: string; estimate: EstimateOption | null }>
>({});

const players = computed<PlayerEstimate[]>(() =>
  mapRoomPlayers(roomPlayerIds.value, allPlayers.value)
);

const myName = computed(() => username.value ?? "");

const revealEstimates = ref<boolean>(false);
const showNameDialog = ref<boolean>(false);
const tempName = ref<string>("");
const showDeleteDialog = ref<boolean>(false);
const showShareDialog = ref<boolean>(false);
const showConfetti = ref<boolean>(false);

const estimateOptions = ESTIMATE_OPTIONS;

const hasEstimates = computed(() =>
  players.value.some((p) => p.estimate != null)
);

const estimateCounts = computed<Record<EstimateOption, number>>(() =>
  getEstimateCounts(players.value, estimateOptions)
);

const isInRoom = computed(() => {
  if (!userId.value) return false;
  return roomPlayerIds.value.includes(userId.value);
});

const openNameDialog = () => {
  tempName.value = "";
  showNameDialog.value = true;
};

const submitName = async () => {
  if (!tempName.value.trim()) return;

  playerStore.setUsername(tempName.value);
  showNameDialog.value = false;

  if (!userId.value || !username.value) return;

  await savePlayer(userId.value, username.value);
  await addPlayerToRoom(roomId, userId.value);
};

const cancelName = () => {
  showNameDialog.value = false;
};

const castEstimate = async (estimate: EstimateOption) => {
  // Check if user is in room first, only prompt for name if not
  if (!isInRoom.value) {
    openNameDialog();
    return;
  }

  await setPlayerEstimate(userId.value, estimate);
};

const toggleRevealEstimates = async () => {
  await setRevealEstimates(roomId, !revealEstimates.value);
};

const resetEstimates = async () => {
  await resetRoomEstimates(roomId);
};

const myChoice = computed<EstimateOption | null>(() => {
  const me = players.value.find((p) => p.name === username.value);
  return me?.estimate ?? null;
});

// Delete dialog logic
const handleDelete = () => {
  showDeleteDialog.value = false;
  confirmDelete();
};

const confirmDelete = async () => {
  await deleteRoom(roomId);
  showDeleteDialog.value = false;
  router.push({ name: "home" });
};

const handleCancel = () => {
  showDeleteDialog.value = false;
};

const onClickDelete = () => {
  showDeleteDialog.value = true;
};

// Handle Share button click
const onClickShare = () => {
  showShareDialog.value = true;
};

const handleShareDone = () => {
  showShareDialog.value = false;
};

// Confetti logic: show when revealed + all estimates match
watch([players, revealEstimates], ([newPlayers, shouldRevealEstimates]) => {
  showConfetti.value = shouldShowConfetti(newPlayers, shouldRevealEstimates);
});

// Hide confetti after 4 seconds
watch(showConfetti, (isConfettiVisible) => {
  if (isConfettiVisible) {
    setTimeout(() => (showConfetti.value = false), 4000);
  }
});

onMounted(async () => {
  // If no username, check localStorage, then query, else open dialog
  if (!username.value) {
    const savedUsername = localStorage.getItem("playerUsername");
    if (savedUsername) {
      playerStore.setUsername(savedUsername);
      // Save player to Firebase and add to room when loading from localStorage
      await savePlayer(userId.value, savedUsername);
      await addPlayerToRoom(roomId, userId.value);
    } else {
      const userFromQuery = route.query.user as string;
      if (userFromQuery) {
        playerStore.setUsername(userFromQuery);
        await savePlayer(userId.value, userFromQuery);
        await addPlayerToRoom(roomId, userId.value);
      } else {
        openNameDialog();
      }
    }
  } else {
    // username already in store (persisted or set earlier) — ensure record exists
    await savePlayer(userId.value, username.value);
    await addPlayerToRoom(roomId, userId.value);
  }

  // ids in the room
  const roomPlayersRef = dbRef(db, `rooms/${roomId}/players`);
  onValue(roomPlayersRef, (snapshot) => {
    const ids = (snapshot.val() as UUID[] | null) ?? [];
    roomPlayerIds.value = ids;
  });

  // all players
  const allPlayersRef = dbRef(db, "players");
  onValue(allPlayersRef, (snapshot) => {
    const data = snapshot.val() as Record<
      string,
      { id: UUID; name: string; estimate: EstimateOption | null }
    > | null;
    allPlayers.value = data ?? {};
  });

  // revealEstimates
  const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`);
  onValue(
    revealRef,
    (snapshot) => (revealEstimates.value = snapshot.val() ?? false)
  );
});
</script>

<template>
  <div class="main-content">
    <ConfettiCanvas v-if="showConfetti" />
    <PageLayout>
      <section class="pa-10 pa-sm-8 pa-md-6 pa-lg-4" elevation="0">
        <header class="text-h6">
          <div class="text-center">
            <h3 class="text-[32px]! text-[#492D7B]! uppercase dark:text-white!">
              Room: {{ roomId }}
            </h3>
            <Button variant="link" @click="onClickShare">
              <Share2
                class="h-5 w-5 text-[#492D7B] dark:text-white"
                aria-hidden="true"
              />
              <span class="!text-lg text-[#492D7B] dark:text-white"
                >Share room</span
              >
            </Button>

            <Button variant="link" @click="onClickDelete">
              <Trash2
                class="h-5 w-5 text-[#492D7B] dark:text-white"
                aria-hidden="true"
              />
              <span class="!text-lg text-[#492D7B] dark:text-white"
                >Delete room</span
              >
            </Button>
          </div>
        </header>
        <div class="my-12 flex flex-wrap items-center justify-center gap-4">
          <PlayerCard
            v-for="(player, index) in players"
            :key="index"
            :estimate="player.estimate ?? null"
            :playerName="player.name"
            :reveal="revealEstimates"
            :my-name="myName"
            :player-id="player.id"
            :room-id="roomId"
          />
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <Button
            class="inline-flex h-11 items-center justify-center rounded-full !border-2 !border-[#2A1449] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-[#492D7B] uppercase hover:bg-[#492D7B]! hover:text-white! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:border-2! dark:border-white! dark:bg-transparent! dark:text-white! dark:hover:bg-white! dark:hover:text-[#492D7B]! dark:focus-visible:outline-white dark:disabled:border-2! dark:disabled:border-white!"
            :disabled="!hasEstimates"
            @click="resetEstimates"
            variant="outline"
            >Delete estimates
          </Button>

          <Button
            aria-label="reveal cards"
            class="inline-flex h-11 items-center justify-center rounded-full !bg-[#EC7F31] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-white uppercase hover:bg-[#CE2935]! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:focus-visible:outline-white"
            :disabled="!hasEstimates"
            @click="toggleRevealEstimates"
          >
            {{ revealEstimates ? "Hide Cards" : "Reveal Cards" }}
          </Button>
        </div>

        <EstimateOptions
          :counts="estimateCounts"
          :my-choice="myChoice"
          :options="estimateOptions"
          :reveal="revealEstimates"
          @select="castEstimate"
        />
      </section>

      <BaseDialog
        v-model="showNameDialog"
        v-model:name="tempName"
        title="Provide your name to enter"
        message=""
        input-label="What would you prefer to be called?"
        cancel-text="Cancel"
        confirm-text="Submit"
        persistent
        variant="nameDialog"
        hide-done
        @cancel="cancelName"
        @submit="submitName"
        @update:name="(newPlayerName: string) => (tempName = newPlayerName)"
      />

      <BaseDialog
        v-model="showDeleteDialog"
        title="Delete room"
        message="Are you sure you want to delete the room of all participants?"
        cancel-text="Cancel"
        confirm-text="Delete room"
        variant="deleteDialog"
        hide-done
        @cancel="handleCancel"
        @submit="handleDelete"
      />

      <BaseDialog
        v-model="showShareDialog"
        :room-id="roomId"
        title="Share room"
        message="Invite people to join the room."
        confirm-text="Done"
        hide-cancel
        variant="shareDialog"
        @submit="handleShareDone"
      />
    </PageLayout>
  </div>
</template>
