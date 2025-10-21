<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-vue-next";

defineProps<{ playerName: string; estimate: string | null; reveal: boolean }>();
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative [perspective:1000px]">
      <div
        class="relative h-[140px] w-[100px] transition-transform duration-500 ease-in-out will-change-transform [transform-style:preserve-3d]"
        :class="reveal ? '[transform:rotateY(180deg)]' : ''"
      >
        <!-- Front -->
        <Card
          class="absolute inset-0 grid place-items-center rounded-lg border-0 bg-[#EDE9F2] [backface-visibility:hidden] dark:bg-white"
        >
          <CardContent
            class="flex h-full w-full items-center justify-center p-0"
          >
            <span v-if="!estimate" class="text-2xl"></span>
            <span v-else class="text-2xl">
              <User class="text-[#EC7F31]" />
            </span>
          </CardContent>
        </Card>

        <!-- Back -->
        <Card
          class="absolute inset-0 grid [transform:rotateY(180deg)] place-items-center rounded-lg border border-neutral-200 bg-white [backface-visibility:hidden] dark:border-neutral-700 dark:bg-neutral-900"
        >
          <CardContent
            class="flex h-full w-full items-center justify-center p-0"
          >
            <span class="text-2xl font-semibold tracking-wide text-[#EC7F31]">
              {{ estimate }}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Player name -->
    <span class="mt-2 text-sm font-medium text-[#492D7B] dark:text-white">
      {{ playerName }}
    </span>
  </div>
</template>
