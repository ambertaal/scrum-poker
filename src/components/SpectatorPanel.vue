<script setup lang="ts">
import { Eye } from "@lucide/vue";

const emit = defineEmits<{ (e: "join"): void }>();
</script>

<template>
  <section
    aria-labelledby="spectator-panel-heading"
    class="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-dashed border-[#492D7B]/50 bg-[#EDE9F2] p-6 text-center sm:flex-row sm:text-left dark:border-white/40 dark:bg-white/5"
  >
    <span
      class="grid size-12 shrink-0 place-items-center rounded-full bg-[#492D7B]/10 text-[#2A1449] dark:bg-white/15 dark:text-white"
    >
      <Eye class="size-5" aria-hidden="true" />
    </span>

    <div class="flex-1">
      <h2
        id="spectator-panel-heading"
        class="text-lg font-bold text-[#2A1449] dark:text-white"
      >
        You're watching as a spectator
      </h2>
      <p class="mt-1 text-[#4A3D63] dark:text-white/85">
        You see everyone's results, but you don't vote. Join as a player to
        pick a card.
      </p>
    </div>

    <button
      type="button"
      class="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#EC7F31] px-6 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-[#26164a] uppercase hover:bg-[#F29B5C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#492D7B] max-sm:w-full dark:focus-visible:outline-white"
      @click="emit('join')"
    >
      Join as player
    </button>
  </section>
</template>
