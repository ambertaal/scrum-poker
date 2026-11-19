<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator
} from "reka-ui";
import { Check, ChevronDown, Eye } from "@lucide/vue";
import PlayerRoleIcon from "@/components/PlayerRoleIcon.vue";
import { PLAYER_ROLES, isPlayerRole, type PlayerRole } from "@/types/player";
import { roleText, switchToSpectatorNote } from "@/components/data/roles";

const { role } = defineProps<{ role: PlayerRole }>();

const emit = defineEmits<{
  (e: "change", role: PlayerRole): void;
}>();

const onSelect = (value: unknown) => {
  if (isPlayerRole(value) && value !== role) emit("change", value);
};
</script>

<template>
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger
      class="mt-2 inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-[#b45f12] px-3 py-1 text-xs font-bold text-[#b45f12] hover:bg-[#b45f12]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45f12] max-sm:min-h-11 max-sm:px-4 max-sm:text-sm dark:border-[#EC7F31] dark:text-[#EC7F31] dark:hover:bg-[#EC7F31]/10 dark:focus-visible:outline-[#EC7F31]"
    >
      <span class="sr-only">Your role:</span>
      {{ roleText[role].label }}
      <ChevronDown class="size-3.5" aria-hidden="true" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="center"
        side="bottom"
        :side-offset="6"
        :collision-padding="20"
        class="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 w-64 max-w-[calc(100vw-40px)] rounded-2xl bg-[#EDE9F2] p-1.5 text-[#2A1449] shadow-xl outline-none dark:bg-[#EDE9F2]"
      >
        <DropdownMenuRadioGroup
          :model-value="role"
          @update:model-value="onSelect"
        >
          <DropdownMenuRadioItem
            v-for="option in PLAYER_ROLES"
            :key="option"
            :value="option"
            class="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-bold outline-none select-none data-[highlighted]:bg-white data-[state=checked]:bg-white"
          >
            <PlayerRoleIcon
              v-if="option === 'player'"
              class="size-4 shrink-0"
            />
            <Eye v-else class="size-4 shrink-0" aria-hidden="true" />
            <span class="flex-1">{{ roleText[option].label }}</span>
            <DropdownMenuItemIndicator>
              <Check class="size-4" aria-hidden="true" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <!-- div, not p: global `.dark p { color: #fff !important }` would override -->
        <div class="px-3 pt-2 pb-1.5 text-xs text-[#4A3D63]">
          {{ switchToSpectatorNote }}
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
