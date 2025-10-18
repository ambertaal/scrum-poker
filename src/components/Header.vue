<template>
  <header
    class="sticky top-0 z-50 bg-[linear-gradient(40deg,#4c1f82,#8c1d82_14%,#cf022b_50%,#ffb15c)] text-white shadow"
  >
    <div class="mx-auto max-w-screen-xl px-4">
      <div class="flex h-16 items-center justify-between">
        <RouterLink
          to="/"
          class="flex items-center gap-3 text-white no-underline hover:opacity-90"
        >
          <img
            alt="Planning Poker logo"
            class="h-9 w-9"
            src="@/assets/logo.svg"
          />
          <h2 class="m-0 text-lg leading-none font-semibold text-white">
            Planning Poker
          </h2>
        </RouterLink>

        <DarkModeToggle />
      </div>
    </div>
  </header>
</template>
