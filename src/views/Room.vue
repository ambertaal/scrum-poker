<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { db } from "@/firebase";
import { ref as dbRef, onValue, type Unsubscribe } from "firebase/database";
import { usePlayerStore, type UUID } from "@/stores/player";
import { storeToRefs } from "pinia";
import PageLayout from "@/layouts/PageLayout.vue";
import ConfettiCanvas from "@/components/ConfettiCanvas.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import RoleMenu from "@/components/RoleMenu.vue";
import SpectatorList from "@/components/SpectatorList.vue";
import SpectatorPanel from "@/components/SpectatorPanel.vue";
import { ESTIMATE_OPTIONS, type EstimateOption } from "@/types/estimates";
import type { PlayerRole } from "@/types/player";
import {
  getSpectators,
  getVoters,
  mapRoomPlayers,
  type PlayerEstimate
} from "@/utils/getRoomPlayers";
import {
  getEstimateCounts,
  shouldShowConfetti
} from "@/utils/getEstimateCounts";
import {
  savePlayer,
  setPlayerEstimate,
  setPlayerRole
} from "@/api/playerService";
import {
  addPlayerToRoom,
  resetRoomEstimates,
  setRevealEstimates,
  deleteRoom
} from "@/api/roomService";
import { joinedAsPlayerMessage } from "@/components/data/roles";

import { Button } from "@/components/ui/button";
import { Check, Share2, Trash2 } from "@lucide/vue";

const playerStore = usePlayerStore();
const { userId, username, role: storedRole } = storeToRefs(playerStore);

const route = useRoute();
const router = useRouter();

const roomId = (route.params as { roomId: string }).roomId;

const roomPlayerIds = ref<UUID[]>([]);
const allPlayers = ref<Record<string, PlayerEstimate>>({});

const players = computed<PlayerEstimate[]>(() =>
  mapRoomPlayers(roomPlayerIds.value, allPlayers.value)
);

/** Participants that vote; spectators never appear as a card. */
const voters = computed(() => getVoters(players.value));
const spectators = computed(() => getSpectators(players.value));

const me = computed(() => players.value.find((p) => p.id === userId.value));

/** Role from the database once we're in the room, else the stored preference. */
const myRole = computed<PlayerRole>(() => me.value?.role ?? storedRole.value);
const isSpectator = computed(() => myRole.value === "spectator");

const myName = computed(() => username.value ?? "");

const revealEstimates = ref<boolean>(false);
const showNameDialog = ref<boolean>(false);
const tempName = ref<string>("");
const tempRole = ref<PlayerRole>(storedRole.value);
const showDeleteDialog = ref<boolean>(false);
const showShareDialog = ref<boolean>(false);
const showConfetti = ref<boolean>(false);

/** Short confirmation after "Join as player". */
const statusMessage = ref<string>("");
const justJoinedAsPlayer = ref<boolean>(false);
let statusTimeout: ReturnType<typeof setTimeout> | null = null;

const estimateOptions = ESTIMATE_OPTIONS;

const hasEstimates = computed(() =>
  voters.value.some((p) => p.estimate != null)
);

const estimateCounts = computed<Record<EstimateOption, number>>(() =>
  getEstimateCounts(voters.value, estimateOptions)
);

const isInRoom = computed(() => {
  if (!userId.value) return false;
  return roomPlayerIds.value.includes(userId.value);
});

const openNameDialog = () => {
  // Prefill from the last session (name + role)
  tempName.value =
    localStorage.getItem("playerUsername") ?? username.value ?? "";
  tempRole.value = storedRole.value;
  showNameDialog.value = true;
};

const joinRoom = async () => {
  await savePlayer(userId.value, username.value, storedRole.value);
  await addPlayerToRoom(roomId, userId.value);
};

const submitName = async () => {
  if (!tempName.value.trim()) return;

  playerStore.setUsername(tempName.value);
  playerStore.setRole(tempRole.value);
  showNameDialog.value = false;

  if (!userId.value || !username.value) return;

  await joinRoom();
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

  // Spectators don't vote
  if (isSpectator.value) return;

  justJoinedAsPlayer.value = false;
  await setPlayerEstimate(userId.value, estimate);
};

const showStatus = (message: string) => {
  statusMessage.value = message;
  if (statusTimeout) clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    statusMessage.value = "";
    statusTimeout = null;
  }, 4000);
};

const changeRole = async (role: PlayerRole) => {
  if (role === myRole.value) return;

  playerStore.setRole(role);
  await setPlayerRole(userId.value, role);

  if (role === "player") {
    justJoinedAsPlayer.value = true;
    showStatus(joinedAsPlayerMessage);
  } else {
    justJoinedAsPlayer.value = false;
    statusMessage.value = "";
  }
};

const joinAsPlayer = () => changeRole("player");

const toggleRevealEstimates = async () => {
  await setRevealEstimates(roomId, !revealEstimates.value);
};

const resetEstimates = async () => {
  await resetRoomEstimates(roomId);
};

const myChoice = computed<EstimateOption | null>(
  () => me.value?.estimate ?? null
);

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

// Keep the stored preference in sync when the role changes elsewhere (other tab)
watch(
  () => me.value?.role,
  (role) => {
    if (role && role !== storedRole.value) playerStore.setRole(role);
  }
);

// Confetti logic: show when revealed + all player estimates match
watch([players, revealEstimates], ([newPlayers, shouldRevealEstimates]) => {
  showConfetti.value = shouldShowConfetti(newPlayers, shouldRevealEstimates);
});

// Hide confetti after 4 seconds
watch(showConfetti, (isConfettiVisible) => {
  if (isConfettiVisible) {
    setTimeout(() => (showConfetti.value = false), 4000);
  }
});

const unsubscribers: Unsubscribe[] = [];

onMounted(async () => {
  // If no username, check localStorage, then query, else open dialog
  if (!username.value) {
    const savedUsername = localStorage.getItem("playerUsername");
    if (savedUsername) {
      playerStore.setUsername(savedUsername);
      // Save player to Firebase and add to room when loading from localStorage
      await joinRoom();
    } else {
      const userFromQuery = route.query.user as string;
      if (userFromQuery) {
        playerStore.setUsername(userFromQuery);
        await joinRoom();
      } else {
        openNameDialog();
      }
    }
  } else {
    // username already in store (persisted or set earlier) — ensure record exists
    await joinRoom();
  }

  // ids in the room
  const roomPlayersRef = dbRef(db, `rooms/${roomId}/players`);
  unsubscribers.push(
    onValue(roomPlayersRef, (snapshot) => {
      const ids = (snapshot.val() as UUID[] | null) ?? [];
      roomPlayerIds.value = ids;
    })
  );

  // all players
  const allPlayersRef = dbRef(db, "players");
  unsubscribers.push(
    onValue(allPlayersRef, (snapshot) => {
      const data = snapshot.val() as Record<string, PlayerEstimate> | null;
      allPlayers.value = data ?? {};
    })
  );

  // revealEstimates
  const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`);
  unsubscribers.push(
    onValue(
      revealRef,
      (snapshot) => (revealEstimates.value = snapshot.val() ?? false)
    )
  );
});

onBeforeUnmount(() => {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  if (statusTimeout) clearTimeout(statusTimeout);
});
</script>

<template>
  <div class="main-content">
    <ConfettiCanvas v-if="showConfetti" />
    <PageLayout>
      <section class="pa-10 pa-sm-8 pa-md-6 pa-lg-4" elevation="0">
        <!-- Status message (e.g. after joining as a player) -->
        <div
          aria-live="polite"
          role="status"
          class="flex min-h-0 justify-center"
        >
          <p
            v-if="statusMessage"
            class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#EDE9F2] px-4 py-1.5 text-sm text-[#2A1449] dark:bg-white/10 dark:text-white"
          >
            <Check
              class="size-4 text-[#b45f12] dark:text-[#EC7F31]"
              aria-hidden="true"
            />
            {{ statusMessage }}
          </p>
        </div>

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
              <span class="text-lg! text-[#492D7B] dark:text-white"
                >Share room</span
              >
            </Button>

            <Button variant="link" @click="onClickDelete">
              <Trash2
                class="h-5 w-5 text-[#492D7B] dark:text-white"
                aria-hidden="true"
              />
              <span class="text-lg! text-[#492D7B] dark:text-white"
                >Delete room</span
              >
            </Button>
          </div>

          <SpectatorList
            :spectators="spectators"
            :my-id="userId"
            :room-id="roomId"
            class="mt-4"
          />
        </header>

        <!-- Player cards: only participants with role "player" -->
        <div
          class="mt-12 mb-10 flex flex-wrap items-start justify-center gap-4"
        >
          <PlayerCard
            v-for="player in voters"
            :key="player.id"
            :estimate="player.estimate ?? null"
            :playerName="player.name"
            :reveal="revealEstimates"
            :my-name="myName"
            :is-me="player.id === userId"
            :highlight="
              player.id === userId && justJoinedAsPlayer && !player.estimate
            "
            :player-id="player.id"
            :room-id="roomId"
          >
            <RoleMenu
              v-if="player.id === userId"
              :role="player.role ?? 'player'"
              @change="changeRole"
            />
          </PlayerCard>
        </div>

        <div
          class="mb-10 flex flex-wrap justify-center gap-4 max-sm:grid max-sm:grid-cols-2"
        >
          <Button
            class="inline-flex h-11 items-center justify-center rounded-full border-2! border-[#2A1449]! px-6 py-3 text-[14px] leading-4.5 font-bold tracking-[0.1em] text-[#492D7B] uppercase hover:bg-[#492D7B]! hover:text-white! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:border-2! dark:border-white! dark:bg-transparent! dark:text-white! dark:hover:bg-white! dark:hover:text-[#492D7B]! dark:focus-visible:outline-white dark:disabled:border-2! dark:disabled:border-white!"
            :disabled="!hasEstimates"
            @click="resetEstimates"
            variant="outline"
            >Delete estimates
          </Button>

          <Button
            class="inline-flex h-11 items-center justify-center rounded-full bg-[#EC7F31]! px-6 py-3 text-[14px] leading-4.5 font-bold tracking-[0.1em] text-[#26164a] uppercase hover:bg-[#F29B5C]! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:focus-visible:outline-white"
            :disabled="!hasEstimates"
            @click="toggleRevealEstimates"
          >
            {{ revealEstimates ? "Hide Cards" : "Reveal Cards" }}
          </Button>
        </div>

        <SpectatorPanel v-if="isSpectator && isInRoom" @join="joinAsPlayer" />

        <EstimateOptions
          v-else
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
        v-model:role="tempRole"
        title="Provide your name to enter"
        message=""
        input-label="What would you prefer to be called?"
        cancel-text="Cancel"
        confirm-text="Submit"
        persistent
        variant="nameDialog"
        @cancel="cancelName"
        @submit="submitName"
      />

      <BaseDialog
        v-model="showDeleteDialog"
        title="Delete room"
        message="Are you sure you want to delete the room of all participants?"
        cancel-text="Cancel"
        confirm-text="Delete room"
        variant="deleteDialog"
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
