<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { ref as dbRef, get } from "firebase/database";
import { db } from "@/firebase";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const { id } = defineProps<{ id: string }>();
const emit = defineEmits<{
  (e: "update:id", value: string): void;
  (e: "submit"): void;
}>();

const playerStore = usePlayerStore();
const { username, userId } = storeToRefs(playerStore);

/**
 * Local state: keep a raw field value so the user can type non-digits.
 */
const rawRoomIdInput = ref<string>(id ?? "");

/**
 * Keep local field in sync if parent changes id externally.
 */
watch(
  () => id,
  (newId) => {
    if (newId !== rawRoomIdInput.value) {
      rawRoomIdInput.value = newId ?? "";
    }
  }
);

const isValidRoom = (roomNumber: string) => /^\d{6,}$/.test(roomNumber);

/** DB-existence state */
const roomExists = ref<boolean | null>(null);
const checking = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const nameTaken = ref<boolean | null>(null);

/** Debounced watcher: only checks if room number has valid format */
watch(rawRoomIdInput, (roomIdInput) => {
  roomExists.value = null;
  nameTaken.value = null;

  if (debounceTimer) clearTimeout(debounceTimer);
  if (!isValidRoom(roomIdInput)) return;

  debounceTimer = setTimeout(async () => {
    checking.value = true;
    try {
      const roomNameRef = dbRef(db, `rooms/${roomIdInput}/roomId`);
      const snap = await get(roomNameRef);
      roomExists.value = snap.exists();

      // Only check name if room exists and we have a username
      if (roomExists.value && username.value?.trim()) {
        const playersRef = dbRef(db, `rooms/${roomIdInput}/players`);
        const playersSnap = await get(playersRef);
        const userName = username.value.trim().toLowerCase();
        if (playersSnap.exists()) {
          const players = playersSnap.val() as Record<
            string,
            { name?: string }
          >;
          nameTaken.value = Object.values(players).some(
            (player) => player?.name?.trim()?.toLowerCase() === userName
          );
        } else {
          nameTaken.value = false;
        }
      } else {
        nameTaken.value = null;
      }
    } catch (e) {
      console.error("Error checking room existence:", e);
      roomExists.value = false;
      nameTaken.value = null;
    } finally {
      checking.value = false;
    }
  }, 300);
});

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

const roomNumberRule = (roomNumber: string) => {
  if (!isValidRoom(roomNumber)) {
    return "Room number must be at least 6 digits and contain only digits";
  }
  if (roomExists.value === false) {
    return "This room number does not exist";
  }
  if (nameTaken.value === true) {
    return "This display name already exists in this room";
  }
  return true;
};

const validationMessage = computed(() => {
  const result = roomNumberRule(rawRoomIdInput.value);
  return result === true ? "" : result;
});
const isInvalid = computed(
  () => !!validationMessage.value && rawRoomIdInput.value.length > 0
);

/**
 * Only propagate valid values to the parent; ignore invalid input.
 */
watch(rawRoomIdInput, (newRoomNumber) => {
  if (isValidRoom(newRoomNumber)) {
    emit("update:id", newRoomNumber);
  }
});

const isDisabled = computed(() => {
  return (
    !isValidRoom(rawRoomIdInput.value) ||
    roomExists.value === false ||
    checking.value ||
    nameTaken.value === true
  );
});

const handleSubmit = () => {
  if (!isValidRoom(rawRoomIdInput.value)) return;
  if (roomExists.value === false) return;
  if (checking.value) return;

  if (isValidRoom(rawRoomIdInput.value)) {
    emit("submit");
  }
};
</script>

<template>
  <div class="rounded-2xl bg-white p-6 text-white sm:p-8 dark:!bg-[#2A1449]">
    <div class="space-y-4">
      <div class="space-y-2">
        <Label
          class="mb-3 block text-base font-bold text-[#2A1449] dark:text-white"
          for="roomNumber"
        >
          Enter existing room number
        </Label>

        <Input
          v-model="rawRoomIdInput"
          id="roomNumber"
          name="roomNumber"
          ref="displayNameField"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          placeholder="e.g. 123456"
          :aria-invalid="isInvalid ? 'true' : 'false'"
          :aria-describedby="isInvalid ? 'roomNumber-error' : undefined"
          class="name-input mx-auto mt-2 w-full rounded-lg border border-neutral-300 bg-white text-left placeholder:text-center focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:ring-neutral-200 [:placeholder-shown]:text-center"
          @keydown.enter="handleSubmit"
        />

        <p v-if="checking" class="mt-2 text-sm text-neutral-500">
          Checking room…
        </p>
        <p
          v-else-if="isInvalid"
          id="roomNumber-error"
          class="mt-2 text-sm !text-red-600"
        >
          {{ validationMessage }}
        </p>
      </div>

      <Button
        :aria-busy="checking ? 'true' : 'false'"
        :disabled="isDisabled"
        class="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full !bg-[#EC7F31] px-6 py-3 pr-6 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-white uppercase hover:!bg-[#CE2935] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:focus-visible:outline-white"
        variant="outline"
        @click="handleSubmit"
      >
        Join Room
      </Button>
    </div>
  </div>
</template>
