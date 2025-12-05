<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow
} from "reka-ui";

const props = defineProps<{
  options: readonly string[];
  counts?: Record<string, number>;
  reveal: boolean;
  myChoice?: string;
}>();

const emit = defineEmits<(event: "select", value: string) => void>();
const handleClick = (option: string) => emit("select", option);

// Responsive arrow
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 600px)").matches;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

const arrow = computed(() => (isMobile.value ? "👇" : "👉"));
</script>

<template>
  <section class="mt-8">
    <div class="flex flex-col items-center justify-center gap-4 md:flex-row">
      <p
        class="text-base font-semibold text-[#492D7B]! md:text-lg dark:text-white!"
      >
        Pick your card {{ arrow }}
      </p>

      <TooltipProvider>
        <div
          class="grid grid-cols-4 gap-2 sm:grid-cols-6 md:auto-cols-max md:grid-flow-col md:grid-cols-none"
        >
          <div
            v-for="option in props.options"
            :key="option"
            class="flex flex-col items-center"
          >
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  :aria-label="`Select ${option}`"
                  @click="handleClick(option)"
                  :class="
                    props.myChoice === option
                      ? '-translate-y-1.5 shadow-lg ring-1 ring-neutral-400'
                      : ''
                  "
                  class="h-20 w-16 transform bg-[#EDE9F2]! text-lg font-semibold text-[#492D7B]! transition duration-200 select-none hover:-translate-y-1 dark:bg-white! dark:text-[#2A1449]!"
                >
                  {{ option }}
                </Button>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  :side-offset="5"
                  class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade rounded-md border bg-[#c7c7c8] px-3 py-2 text-sm leading-snug whitespace-normal shadow-sm will-change-[transform,opacity] select-none dark:text-[#492D7B]"
                >
                  Click to pick your estimate
                  <TooltipArrow
                    class="fill-[#c7c7c8] stroke-gray-200"
                    :width="12"
                    :height="6"
                  />
                </TooltipContent>
              </TooltipPortal>
            </TooltipRoot>

            <div
              v-if="props.reveal && (props.counts?.[option] ?? 0) > 0"
              class="mt-1 text-center text-sm text-[#492D7B] dark:text-white"
            >
              {{ props.counts?.[option] }}x
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  </section>
</template>
