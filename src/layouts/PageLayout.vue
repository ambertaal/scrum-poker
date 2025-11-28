<template>
  <div class="flex min-h-screen flex-col">
    <Header />

    <main class="flex flex-1 flex-col">
      <div class="w-full bg-gray-50 dark:bg-[#2a1449]">
        <div class="mx-auto flex max-w-6xl justify-center px-4 py-6">
          <div class="w-full text-center">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
