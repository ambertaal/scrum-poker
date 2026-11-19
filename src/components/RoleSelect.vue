<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { Eye } from "@lucide/vue";
import PlayerRoleIcon from "@/components/PlayerRoleIcon.vue";
import { PLAYER_ROLES, type PlayerRole } from "@/types/player";
import { roleText } from "@/components/data/roles";

const model = defineModel<PlayerRole>({ default: "player" });

const baseId = useId();
const labelId = `${baseId}-label`;
const descriptionId = `${baseId}-description`;

const buttons = ref<HTMLButtonElement[]>([]);

const description = computed(() => roleText[model.value].description);

const select = (role: PlayerRole, focus = false) => {
  model.value = role;
  if (focus) {
    const index = PLAYER_ROLES.indexOf(role);
    buttons.value[index]?.focus();
  }
};

/** Radiogroup keyboard pattern: arrows move + select, Home/End jump. */
const onKeydown = (event: KeyboardEvent) => {
  const current = PLAYER_ROLES.indexOf(model.value);
  const last = PLAYER_ROLES.length - 1;
  let next: number | null = null;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = current === last ? 0 : current + 1;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = current === 0 ? last : current - 1;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = last;
      break;
  }

  if (next === null) return;
  event.preventDefault();
  select(PLAYER_ROLES[next]!, true);
};
</script>

<template>
  <div class="flex w-full flex-col items-center gap-3">
    <p
      :id="labelId"
      class="text-base font-bold text-[#2A1449] dark:text-white"
    >
      How do you want to join?
    </p>

    <div
      role="radiogroup"
      :aria-labelledby="labelId"
      :aria-describedby="descriptionId"
      class="grid w-full grid-cols-2 gap-1 rounded-full border border-[#492D7B] bg-white p-1 dark:border-white/60 dark:bg-transparent"
      @keydown="onKeydown"
    >
      <button
        v-for="role in PLAYER_ROLES"
        :key="role"
        ref="buttons"
        type="button"
        role="radio"
        :aria-checked="model === role"
        :tabindex="model === role ? 0 : -1"
        class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#492D7B] dark:focus-visible:outline-white"
        :class="
          model === role
            ? 'bg-[#492D7B] text-white dark:bg-white dark:text-[#2A1449]'
            : 'text-[#492D7B] hover:bg-[#EDE9F2] dark:text-white dark:hover:bg-white/10'
        "
        @click="select(role)"
      >
        <PlayerRoleIcon v-if="role === 'player'" class="size-4 shrink-0" />
        <Eye v-else class="size-4 shrink-0" aria-hidden="true" />
        {{ roleText[role].label }}
      </button>
    </div>

    <p
      :id="descriptionId"
      aria-live="polite"
      class="text-center text-sm text-[#4A3D63] dark:text-white/85"
    >
      {{ description }}
    </p>
  </div>
</template>
