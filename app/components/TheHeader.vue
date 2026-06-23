<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (v) => (colorMode.preference = v ? "dark" : "light"),
});

// Section previews only — not links yet, the sections ship later.
const nav = ["Features", "E-Invoicing", "Engine"];
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-brand-100/70 bg-(--canvas)/75 backdrop-blur-md dark:border-white/10"
  >
    <div class="mx-auto flex h-16 max-w-368 items-center justify-between px-5 sm:px-8">
      <NuxtLink to="/" class="group flex items-center gap-2.5">
        <img src="/img/jasy-logo-final.svg" alt="" class="h-8 w-auto" />
        <span
          class="font-mono text-base font-semibold tracking-tight text-brand-900 dark:text-white"
        >
          jasy<span class="text-brand-600 dark:text-brand-300">pdf</span>
        </span>
        <span
          class="rounded-full bg-accent-400/20 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-accent-400/40 dark:text-accent-300"
        >
          soon
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <span
          v-for="item in nav"
          :key="item"
          class="cursor-default select-none rounded-md px-3 py-1.5 font-mono text-sm text-brand-900/40 dark:text-white/35"
        >
          {{ item }}
        </span>
        <NuxtLink
          to="/docs/cli"
          class="rounded-md px-3 py-1.5 font-mono text-sm text-brand-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
        >
          Docs
        </NuxtLink>
        <NuxtLink
          to="/validate"
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-sm text-brand-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
        >
          <UIcon name="i-lucide-shield-check" class="size-4 text-brand-500 dark:text-brand-300" />
          Validate
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1.5">
        <UButton
          to="https://github.com/jasy-pdf"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="GitHub"
        />
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Toggle color mode"
            @click="isDark = !isDark"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <UButton
          label="Get started"
          color="primary"
          size="sm"
          disabled
          class="ml-1 hidden font-medium sm:inline-flex"
          title="Available soon"
        />
      </div>
    </div>
  </header>
</template>
