<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-auto">
    <section
      class="w-full bg-[linear-gradient(40deg,#4c1f82,#8c1d82_14%,#cf022b_50%,#ffb15c)] py-10 text-white"
    >
      <div class="mx-auto max-w-screen-xl px-4">
        <div class="mb-2 grid gap-6 md:grid-cols-2">
          <div>
            <div class="flex items-center gap-3">
              <img
                alt="Planning Poker logo"
                src="@/assets/logo.svg"
                class="h-9 w-9"
              />
              <div class="text-lg leading-none font-semibold">
                Planning Poker
              </div>
            </div>
            <p class="mt-3 max-w-prose text-sm text-white dark:text-white">
              Lightweight, real-time Scrum Poker to keep your planning fast and
              focused.
            </p>
          </div>
        </div>

        <div class="my-6 h-px w-full bg-white/50"></div>

        <div
          class="mt-4 flex items-center justify-between text-xs text-white dark:text-white"
        >
          <span>© {{ year }} Planning Poker. All rights reserved.</span>
        </div>
      </div>
    </section>
  </footer>
</template>
