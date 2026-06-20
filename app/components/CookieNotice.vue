<script setup lang="ts">
/**
 * Transparency bar, not a consent gate. We only use strictly-necessary local storage (theme +
 * this notice's own dismissed flag), so no consent is required under § 25 (2) TDDDG - hence a
 * single "OK", no accept/reject. Starts hidden and reveals on mount, so SSR renders nothing and
 * there is no hydration mismatch from reading localStorage.
 */
const KEY = "jasy-notice-dismissed";
const visible = ref(false);

onMounted(() => {
  if (!localStorage.getItem(KEY)) visible.value = true;
});

function dismiss() {
  localStorage.setItem(KEY, "1");
  visible.value = false;
}
</script>

<template>
  <Transition name="notice">
    <div
      v-if="visible"
      class="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-brand-200 bg-[var(--canvas)]/95 p-4 shadow-xl shadow-brand-900/10 backdrop-blur-md sm:inset-x-auto sm:left-1/2 sm:right-auto sm:-translate-x-1/2 dark:border-white/10"
      role="region"
      aria-label="Privacy notice"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <UIcon name="i-lucide-shield-check" class="size-5 shrink-0 text-brand-500" />
        <p class="text-sm leading-relaxed text-brand-900/80 dark:text-white/70">
          Essential storage only. No tracking, no third-party cookies.
          <NuxtLink
            to="/privacy"
            class="font-medium text-brand-600 underline underline-offset-2 dark:text-brand-300"
          >
            Learn more
          </NuxtLink>
        </p>
        <UButton
          color="primary"
          size="sm"
          class="shrink-0 self-end font-medium sm:self-auto"
          @click="dismiss"
        >
          OK
        </UButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.notice-enter-active,
.notice-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .notice-enter-active,
  .notice-leave-active {
    transition: none;
  }
}
</style>
