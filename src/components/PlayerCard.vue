<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { User, Trash2, LucideMessageCircleQuestionMark } from "lucide-vue-next";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow
} from "reka-ui";
import type { UUID } from "@/stores/player";
import { removePlayerFromRoom } from "@/api/roomService";
import { type EstimateOption } from "@/types/estimates";

const {
  estimate = null,
  playerId,
  roomId
} = defineProps<{
  playerId: UUID;
  roomId: string;
  playerName: string;
  estimate?: EstimateOption | null;
  reveal: boolean;
  myName: string;
}>();

const emit = defineEmits<{
  (e: "removed", playerId: UUID): void;
}>();

const handleRemoveClick = async () => {
  try {
    await removePlayerFromRoom(roomId, playerId);
    emit("removed", playerId);
  } catch (error) {
    console.error("Error removing player:", error);
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative [perspective:1000px]">
      <TooltipProvider>
        <div
          class="relative h-[140px] w-[100px] transition-transform duration-500 ease-in-out will-change-transform [transform-style:preserve-3d]"
          :class="reveal ? '[transform:rotateY(180deg)]' : ''"
        >
          <!-- Front -->
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Card
                class="absolute inset-0 grid place-items-center rounded-lg border-0 bg-[#EDE9F2] [backface-visibility:hidden] dark:bg-white"
              >
                <CardContent
                  class="flex h-full w-full items-center justify-center p-0"
                >
                  <span
                    v-if="!estimate"
                    class="text-2xl"
                    :class="
                      playerName === myName
                        ? 'text-[#EC7F31]'
                        : 'text-[#492D7B]'
                    "
                  >
                    <LucideMessageCircleQuestionMark
                      :class="
                        playerName === myName
                          ? 'text-[#EC7F31]'
                          : 'text-[#94a3b8]'
                      "
                    />
                  </span>
                  <span v-else class="text-2xl">
                    <User
                      :class="
                        playerName === myName
                          ? 'text-[#EC7F31]'
                          : 'text-[#492D7B]'
                      "
                    />
                  </span>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="top"
                :side-offset="5"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade leading-snug whitespace-normal will-change-[transform,opacity] select-none"
              >
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      class="rounded-full bg-white! shadow-sm"
                      @click="handleRemoveClick"
                    >
                      <Trash2 class="text-red-500" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipPortal>
                    <TooltipContent
                      side="right"
                      :side-offset="5"
                      class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade rounded-md border bg-[#c7c7c8] px-3 py-2 text-sm leading-snug whitespace-normal shadow-sm will-change-[transform,opacity] select-none dark:text-[#492D7B]"
                    >
                      Remove player
                      <TooltipArrow
                        class="fill-[#c7c7c8] stroke-gray-200"
                        :width="12"
                        :height="6"
                      />
                    </TooltipContent>
                  </TooltipPortal>
                </TooltipRoot>
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>

          <!-- Back -->
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Card
                class="absolute inset-0 grid [transform:rotateY(180deg)] place-items-center rounded-lg border border-neutral-200 bg-white [backface-visibility:hidden] dark:border-neutral-700 dark:bg-neutral-900"
              >
                <CardContent
                  class="flex h-full w-full items-center justify-center p-0"
                >
                  <span
                    class="text-2xl font-semibold tracking-wide"
                    :class="
                      playerName === myName
                        ? 'text-[#EC7F31]'
                        : 'text-[#492D7B]'
                    "
                  >
                    {{ estimate || "-" }}
                  </span>
                </CardContent>
              </Card>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent
                side="top"
                :side-offset="5"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade leading-snug whitespace-normal will-change-[transform,opacity] select-none"
              >
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      class="rounded-full bg-white! shadow-sm"
                      @click="handleRemoveClick"
                    >
                      <Trash2 class="text-red-500" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipPortal>
                    <TooltipContent
                      side="right"
                      :side-offset="5"
                      class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade rounded-md border bg-[#c7c7c8] px-3 py-2 text-sm leading-snug whitespace-normal shadow-sm will-change-[transform,opacity] select-none dark:text-[#492D7B]"
                    >
                      Remove player
                      <TooltipArrow
                        class="fill-[#c7c7c8] stroke-gray-200"
                        :width="12"
                        :height="6"
                      />
                    </TooltipContent>
                  </TooltipPortal>
                </TooltipRoot>
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </div>
      </TooltipProvider>
    </div>

    <!-- Player name -->
    <span
      class="mt-2 text-sm font-medium"
      :class="
        playerName === myName
          ? 'text-[#EC7F31]'
          : 'text-[#492D7B] dark:text-white'
      "
    >
      {{ playerName }}
    </span>
  </div>
</template>
