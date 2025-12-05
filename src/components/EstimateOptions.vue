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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const props = defineProps<{
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
  <section class="mt-12">
    <div
      class="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start"
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
                v-if="props.reveal && (props.counts?.[option] ?? 0) > 0"
                class="mt-1 text-center text-sm text-[#492D7B] dark:text-white"
              >
                {{ props.counts?.[option] }}x
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
