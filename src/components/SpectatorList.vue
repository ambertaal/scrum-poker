<script setup lang="ts">
import { Eye, X } from "@lucide/vue";
import type { PlayerEstimate, UUID } from "@/types/player";
import { removePlayerFromRoom } from "@/api/roomService";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow
} from "reka-ui";

const { spectators, myId, roomId } = defineProps<{
  spectators: PlayerEstimate[];
  myId: string;
  roomId: string;
}>();

const removeSpectator = async (id: UUID) => {
  try {
    await removePlayerFromRoom(roomId, id);
  } catch (error) {
    console.error("Error removing spectator:", error);
  }
};
</script>

<template>
  <section
    v-if="spectators.length > 0"
    aria-labelledby="spectators-heading"
    class="flex flex-wrap items-center justify-center gap-2 max-sm:justify-start"
  >
    <h4
      id="spectators-heading"
      class="mr-2 inline-flex items-center gap-2 text-sm font-bold text-[#2A1449] dark:text-white"
    >
      <Eye class="size-4" aria-hidden="true" />
      Spectators ({{ spectators.length }})
    </h4>
    <TooltipProvider :delay-duration="300">
      <ul class="contents">
        <li
          v-for="spectator in spectators"
          :key="spectator.id"
          class="inline-flex items-center gap-1 rounded-full border py-1 pl-3 text-sm"
          :class="[
            spectator.id === myId ? 'pr-3' : 'pr-1.5',
            spectator.id === myId
              ? 'border-[#b45f12] text-[#b45f12] dark:border-[#EC7F31] dark:text-[#EC7F31]'
              : 'border-[#492D7B]/50 text-[#2A1449] dark:border-white/50 dark:text-white'
          ]"
        >
          {{ spectator.name
          }}<template v-if="spectator.id === myId"> (you)</template>
          <TooltipRoot v-if="spectator.id !== myId">
            <TooltipTrigger as-child>
              <button
                type="button"
                :aria-label="`Remove ${spectator.name}`"
                class="relative grid size-6 cursor-pointer place-items-center rounded-full after:absolute after:-inset-2.5 hover:bg-[#492D7B]/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#492D7B] dark:hover:bg-white/15 dark:focus-visible:outline-white"
                @click="removeSpectator(spectator.id)"
              >
                <X class="size-3.5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="top"
                :side-offset="6"
                class="z-50 rounded-md bg-[#2A1449] px-3 py-1.5 text-sm text-white shadow-md select-none dark:bg-white dark:text-[#2A1449]"
              >
                Remove {{ spectator.name }}?
                <TooltipArrow
                  class="fill-[#2A1449] dark:fill-white"
                  :width="12"
                  :height="6"
                />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </li>
      </ul>
    </TooltipProvider>
  </section>
</template>
