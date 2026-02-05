<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow
} from "reka-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

const { options, counts, reveal, myChoice } = defineProps<{
  options: readonly string[];
  counts?: Record<string, number>;
  reveal: boolean;
  myChoice?: string;
}>();

const emit = defineEmits<(event: "select", value: string) => void>();

// Alert state
const showAlert = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

const handleClick = (option: string) => {
  emit("select", option);

  // show the alert
  showAlert.value = true;

  // reset timer if user clicks multiple times quickly
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  // auto-hide alert after 2.5s
  alertTimeout = setTimeout(() => {
    showAlert.value = false;
    alertTimeout = null;
  }, 2500);
};

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
const arrow = computed(() => (isMobile.value ? "👇" : "👉"));
</script>

<template>
  <section class="mt-12">
    <div
      class="flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-center"
    >
      <p
        class="text-base font-semibold text-[#492D7B]! md:text-lg dark:text-white!"
      >
        Pick your card {{ arrow }}
      </p>

      <!-- Card grid -->
      <div class="flex flex-col items-center gap-3">
        <TooltipProvider>
          <div
            class="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-14"
          >
            <div
              v-for="option in options"
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
                      myChoice === option
                        ? '-translate-y-1.5 bg-gray-700! text-white'
                        : 'bg-[#EDE9F2]! text-[#492D7B]! dark:bg-white! dark:text-[#2A1449]'
                    "
                    class="h-20 w-16 transform text-lg font-semibold transition duration-200 select-none hover:-translate-y-1"
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
                v-if="reveal && (counts?.[option] ?? 0) > 0"
                class="mt-1 text-center text-sm text-[#492D7B] dark:text-white"
              >
                {{ counts?.[option] }}x
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  </section>

  <!-- Alert below the section -->
  <div class="mt-4 flex justify-center">
    <Alert
      v-if="showAlert"
      class="w-full max-w-3xs rounded-lg border-green-300 bg-green-100 text-green-900 shadow-md"
    >
      <AlertDescription class="text-sm dark:text-[#492D7B]">
        Your estimation has been submitted.
      </AlertDescription>
    </Alert>
  </div>
</template>
