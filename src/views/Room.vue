<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { db } from "@/firebase";
import { ref as dbRef, get, onValue, set, update } from "firebase/database";
import { usePlayerStore, type UUID } from "@/stores/player";
import { storeToRefs } from "pinia";
import PageLayout from "@/layouts/PageLayout.vue";
import ConfettiCanvas from "@/components/ConfettiCanvas.vue";

// shadcn components
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
  Record<string, { id: UUID; name: string; estimate: string | null }>
>({});
const players = computed(() =>
  roomPlayerIds.value
    .map((id) => {
      const player = allPlayers.value[id];
      if (!player) return null;
      return {
        id,
        name: player.name,
        estimate: player.estimate ?? null
      };
    })
    .filter(
      (player): player is { id: UUID; name: string; estimate: string | null } =>
        player !== null
    )
);

const revealEstimates = ref<boolean>(false);
const showNameDialog = ref<boolean>(false);
const tempName = ref<string>("");
const showDeleteDialog = ref<boolean>(false);
const showShareDialog = ref<boolean>(false);
const showConfetti = ref<boolean>(false);

const estimateOptions = [
  "0",
  "0.5",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "20",
  "40",
  "100",
  "?",
  "☕"
];

const hasEstimates = computed(() =>
  players.value.some((p) => p.estimate != null)
);

const estimateCounts = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {};
  estimateOptions.forEach((option) => {
    counts[option] = 0;
  });

  players.value.forEach((player) => {
    if (player.estimate != null && counts[player.estimate] != null) {
      counts[player.estimate] += 1;
    }
  });
  return counts;
});

const openNameDialog = () => {
  tempName.value = "";
  showNameDialog.value = true;
};

const submitName = async () => {
  if (!tempName.value.trim()) return;
  playerStore.setUsername(tempName.value);
  showNameDialog.value = false;

  const playerRef = dbRef(db, `players/${userId.value}`);
  await set(playerRef, {
    userId: userId.value,
    name: username.value,
    estimate: null
  });

  const roomPlayersRef = dbRef(db, `rooms/${roomId}/players`);
  const snapshot = await get(roomPlayersRef);
  const currentIds = (snapshot.val() as UUID[] | null) ?? [];

  if (!currentIds.includes(userId.value)) {
    await set(roomPlayersRef, [...currentIds, userId.value]);
  }
};

const cancelName = () => {
  showNameDialog.value = false;
};

onMounted(() => {
  // If no username, check query or else open dialog
  if (!username.value) {
    const userFromQuery = route.query.user as string;
    if (userFromQuery) {
      playerStore.setUsername(userFromQuery);
    } else {
      openNameDialog();
    }
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
      { id: UUID; name: string; estimate: string | null }
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

const castEstimate = async (estimate: string) => {
  if (!userId.value) {
    openNameDialog();
    return;
  }
  const estimateRef = dbRef(db, `players/${userId.value}/estimate`);
  await set(estimateRef, estimate);
};

const toggleRevealEstimates = async () => {
  const revealRef = dbRef(db, `rooms/${roomId}/revealEstimates`);
  await set(revealRef, !revealEstimates.value);
};

const resetEstimates = async () => {
  const playersRef = dbRef(db, `rooms/${roomId}/players`);
  const snapshot = await get(playersRef);
  if (!snapshot.exists()) return;

  const updates: Record<string, null> = {};
  Object.keys(snapshot.val()).forEach((playerId) => {
    updates[`rooms/${roomId}/players/${playerId}/estimate`] = null;
  });

  // hide cards again
  updates[`rooms/${roomId}/revealEstimates`] = false as unknown as null;

  await update(dbRef(db), updates);
};

const myChoice = computed<string>(() => {
  const me = players.value.find((p) => p.name === username.value);
  return me?.estimate ?? "";
});

// Delete dialog logic
const handleDelete = () => {
  showDeleteDialog.value = false;
  confirmDelete();
};

const confirmDelete = async () => {
  const playersRef = dbRef(db, `rooms/${roomId}/players`);
  await set(playersRef, null);
  showDeleteDialog.value = false;
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
  if (!shouldRevealEstimates) {
    showConfetti.value = false;
    return;
  }

  const estimates = newPlayers
    .map((player) => player.estimate)
    .filter((estimate): estimate is string => estimate != null); // laat null/undefined weg

  const hasAtLeastTwoPlayers = newPlayers.length >= 2;
  const everyoneHasEstimated = estimates.length === newPlayers.length;
  const uniqueEstimates = new Set(estimates);

  showConfetti.value =
    hasAtLeastTwoPlayers && everyoneHasEstimated && uniqueEstimates.size === 1;
});

// Hide confetti after 4 seconds
watch(showConfetti, (isConfettiVisible) => {
  if (isConfettiVisible) {
    setTimeout(() => (showConfetti.value = false), 4000);
  }
});
</script>

<template>
  <div class="main-content">
    <ConfettiCanvas v-if="showConfetti" />
    <PageLayout>
      <section
        class="pa-10 pa-sm-8 pa-md-6 pa-lg-4 estimation-cards"
        elevation="0"
      >
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
                >Clear room</span
              >
            </Button>
          </div>
        </header>
        <div class="my-4 flex flex-wrap items-center justify-center gap-4">
          <PlayerCard
            v-for="(player, index) in players"
            :key="index"
            :estimate="player.estimate ?? null"
            :playerName="player.name"
            :reveal="revealEstimates"
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
        title="Clear room"
        message="Are you sure you want to clear the room of all participants?"
        cancel-text="Cancel"
        confirm-text="Clear room"
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
