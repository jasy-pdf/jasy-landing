<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (v) => (colorMode.preference = v ? "dark" : "light"),
});

const nav = [
  { label: "Features", href: "#features" },
  { label: "E-Invoicing", href: "#einvoicing" },
  { label: "Engine", href: "#engine" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-brand-100/70 bg-[var(--canvas)]/75 backdrop-blur-md dark:border-white/10"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
      <a href="#top" class="group flex items-center gap-2.5">
        <img src="/img/jasy-logo-final.svg" alt="" class="h-8 w-auto" />
        <span
          class="font-mono text-base font-semibold tracking-tight text-brand-900 dark:text-white"
        >
          jasy<span class="text-brand-600 dark:text-brand-300">pdf</span>
        </span>
      </a>

      <nav class="hidden items-center gap-1 md:flex">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="rounded-md px-3 py-1.5 font-mono text-sm text-brand-900/70 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
        >
          {{ item.label }}
        </a>
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
          to="#features"
          label="Get started"
          color="primary"
          size="sm"
          class="ml-1 hidden font-medium sm:inline-flex"
        />
      </div>
    </div>
  </header>
</template>
