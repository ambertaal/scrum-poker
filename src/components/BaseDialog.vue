<script setup lang="ts">
import { computed } from "vue";
import { useClipboard } from "@vueuse/core";
import { useRouter } from "vue-router";

// shadcn-vue
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const {
  title,
  message,
  modelValue,
  variant,
  persistent = false,
  confirmText = "OK",
  cancelText = "Cancel",
  inputLabel = "Value",
  name,
  roomId,
  hideCancel = false,
  hideConfirm = false,
  hideDone = false
} = defineProps<{
  modelValue: boolean;
  title: string;
  message?: string;
  variant: "nameDialog" | "deleteDialog" | "shareDialog";
  persistent?: boolean;
  maxWidth?: number | string;
  confirmText?: string;
  cancelText?: string;
  name?: string;
  inputLabel?: string;
  roomId?: string;
  hideCancel?: boolean;
  hideConfirm?: boolean;
  hideDone?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:name", value: string): void;
  (e: "submit", value?: string): void;
  (e: "cancel"): void;
}>();

const router = useRouter();

/** v-model bridge */
const showDialog = computed({
  get: () => modelValue,
  set: (isVisible: boolean) => emit("update:modelValue", isVisible)
});

/** Prevent closing when persistent=true (ignore overlay/escape) */
const handleOpenChange = (nextOpen: boolean) => {
  if (persistent && !nextOpen) return;
  showDialog.value = nextOpen;
};

/** nameDialog */
const tempName = computed({
  get: () => name ?? "",
  set: (val: string) => emit("update:name", val)
});

/** shareDialog */
const roomUrl = computed(() => {
  if (!roomId) return window.location.origin;
  const href = router.resolve({ name: "room", params: { roomId } }).href;
  return `${window.location.origin}${href}`;
});

const { copy, copied } = useClipboard();
const copyUrl = async () => {
  await copy(roomUrl.value);
};

/** actions */
const handleSubmit = () => {
  emit("submit");
};

const handleCancel = () => {
  emit("cancel");
  showDialog.value = false;
};
</script>

<template>
  <Dialog :open="showDialog" @update:open="handleOpenChange">
    <DialogContent
      class="rounded-2xl bg-[#EDE9F2] !p-6 text-white sm:max-w-[420px] sm:p-8 dark:bg-[#2A1449]!"
    >
      <DialogHeader class="mt-4">
        <DialogTitle class="text-[#2A1449] dark:text-white">
          <slot name="title">{{ title }}</slot>
        </DialogTitle>
        <DialogDescription v-if="message && variant !== 'nameDialog'">
          {{ message }}
        </DialogDescription>
      </DialogHeader>

      <!-- Body -->
      <div class="mt-4 space-y-4">
        <!-- NameDialog -->
        <template v-if="variant === 'nameDialog'">
          <div class="space-y-2 flex flex-col items-center ">
            <Label
              class="mb-3 pt-4 text-base font-bold text-[#2A1449] dark:text-white"
              for="inputLabel"
              >{{ inputLabel }}</Label
            >
            <Input
              v-model="tempName"
              id="inputLabel"
              type="text"
              inputmode="string"
              autocomplete="off"
              placeholder="Enter a display name"
              class="name-input mx-auto mt-2 w-full rounded-lg bg-white text-left [:placeholder-shown]:text-center placeholder:text-center""
              @keydown.enter="handleSubmit"
            />
            <p v-if="message" class="text-xs text-neutral-500">{{ message }}</p>
          </div>
        </template>

        <!-- ShareDialog -->
        <template v-else-if="variant === 'shareDialog'">
          <div class="mt-2 flex items-center gap-2">
            <Input
              :model-value="roomUrl"
              readonly
              class="!text-[#492D7B] dark:text-white!"
            />
            <Button
              type="button"
              variant="secondary"
              class="shrink-0"
              :aria-live="copied ? 'polite' : 'off'"
              @click="copyUrl"
            >
              {{ copied ? "Copied" : "Copy" }}
            </Button>
          </div>
        </template>
      </div>

      <!-- Footer / Actions -->
      <DialogFooter class="flex w-full items-center justify-end gap-2">
        <slot name="actions">
          <Button
            v-if="!hideCancel"
            class="inline-flex h-11 items-center justify-center rounded-full !border-2 !border-[#2A1449] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-[#492D7B] uppercase hover:bg-[#492D7B]! hover:text-white! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:border-2! dark:border-white! dark!bg-transparent! dark:text-white! dark:hover:bg-white! dark:hover:text-[#492D7B]! dark:focus-visible:outline-white dark:disabled:border-2! dark:disabled:border-white!"
            type="button"
            variant="outline"
            @click="handleCancel"
          >
            {{ cancelText }}
          </Button>
          <Button
            v-if="!hideConfirm"
            class="inline-flex h-11 items-center justify-center rounded-full !bg-[#EC7F31] px-6 py-3 text-[14px] leading-[18px] font-bold tracking-[0.1em] text-white uppercase hover:bg-[#CE2935]! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale dark:focus-visible:outline-white"
            type="button"
            @click="handleSubmit"
          >
            {{ confirmText }}
          </Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
