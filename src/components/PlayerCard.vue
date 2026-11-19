<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { User, Trash2, LucideMessageCircleQuestionMark } from "@lucide/vue";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import type { UUID } from "@/stores/player";
import { removePlayerFromRoom } from "@/api/roomService";
import { type EstimateOption } from "@/types/estimates";

const {
  estimate = null,
  playerId,
  roomId,
  playerName,
  myName,
  isMe: isMeProp = false,
  highlight = false
} = defineProps<{
  playerId: UUID;
  roomId: string;
  playerName: string;
  estimate?: EstimateOption | null;
  reveal: boolean;
  myName: string;
  /** Identity by id (preferred); name comparison kept as fallback. */
  isMe?: boolean;
  /** Orange ring, e.g. right after joining as a player. */
  highlight?: boolean;
}>();

const isMe = computed(() => isMeProp || playerName === myName);

const emit = defineEmits<{
  (e: "removed", playerId: UUID): void;
}>();

const isPopoverOpen = ref(false);

const handleRemoveClick = async () => {
  try {
    await removePlayerFromRoom(roomId, playerId);
    isPopoverOpen.value = false;
    emit("removed", playerId);
  } catch (error) {
    console.error("Error removing player:", error);
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <Popover v-model:open="isPopoverOpen">
      <PopoverTrigger as-child>
        <button
          type="button"
          class="relative cursor-pointer rounded-lg [perspective:1000px] focus-visible:ring-[3px] focus-visible:ring-[#492D7B]/50 focus-visible:outline-none"
          :aria-label="`Options for ${playerName}`"
        >
          <div
            class="relative h-35 w-25 rounded-lg transition-transform duration-500 ease-in-out will-change-transform [transform-style:preserve-3d]"
            :class="[
              reveal ? '[transform:rotateY(180deg)]' : '',
              highlight ? 'ring-[3px] ring-[#EC7F31]' : ''
            ]"
          >
            <!-- Front -->
            <Card
              class="absolute inset-0 grid place-items-center rounded-lg border-0 bg-[#EDE9F2] [backface-visibility:hidden] dark:bg-white"
            >
              <CardContent
                class="flex h-full w-full items-center justify-center p-0"
              >
                <span
                  v-if="!estimate"
                  class="text-2xl"
                  :class="isMe ? 'text-[#b45f12]' : 'text-[#492D7B]'"
                >
                  <LucideMessageCircleQuestionMark
                    :class="isMe ? 'text-[#b45f12]' : 'text-[#94a3b8]'"
                  />
                </span>
                <span v-else class="text-2xl">
                  <User :class="isMe ? 'text-[#b45f12]' : 'text-[#492D7B]'" />
                </span>
              </CardContent>
            </Card>

            <!-- Back -->
            <Card
              class="absolute inset-0 grid [transform:rotateY(180deg)] place-items-center rounded-lg border border-neutral-200 bg-white [backface-visibility:hidden]"
            >
              <CardContent
                class="flex h-full w-full items-center justify-center p-0"
              >
                <span
                  class="text-2xl font-semibold tracking-wide"
                  :class="isMe ? 'text-[#b45f12]' : 'text-[#492D7B]'"
                >
                  {{ estimate || "-" }}
                </span>
              </CardContent>
            </Card>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" class="w-auto p-3">
        <p class="mb-3 text-sm font-medium">Remove {{ playerName }}?</p>
        <div class="flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="isPopoverOpen = false">
            Cancel
          </Button>
          <Button variant="destructive" size="sm" @click="handleRemoveClick">
            <Trash2 />
            Remove
          </Button>
        </div>
      </PopoverContent>
    </Popover>

    <!-- Player name -->
    <span
      class="mt-2 text-sm font-medium"
      :class="
        isMe
          ? 'text-[#b45f12] dark:text-[#EC7F31]'
          : 'text-[#492D7B] dark:text-white'
      "
    >
      {{ playerName }}
    </span>

    <!-- Extra content below the name (e.g. role chip for yourself) -->
    <slot />
  </div>
</template>
