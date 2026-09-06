<script setup lang="ts">
// The stage (alpha / beta / rc) comes from the published version, not from this file - see
// useRelease(). A stable release has no pre-release tag, so the pill disappears by itself.
const { stage } = useRelease();

const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (v) => (colorMode.preference = v ? "dark" : "light"),
});

// Named handlers rather than `@click="x = !x"`: an inline assignment evaluates to the value it
// assigned, and UButton's `onClick` is typed to return nothing.
function toggleDark(): void {
  isDark.value = !isDark.value;
}

// Mobile menu: closed by default, and closes itself whenever the route changes (i.e. a link tap).
const mobileOpen = ref(false);
function toggleMobile(): void {
  mobileOpen.value = !mobileOpen.value;
}

const route = useRoute();
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
);
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
          v-if="stage"
          class="rounded-full bg-brand-600/12 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-600/30 dark:bg-brand-400/15 dark:text-brand-300 dark:ring-brand-400/30"
        >
          {{ stage }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          to="/showroom"
          class="rounded-md px-3 py-1.5 font-mono text-sm text-brand-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
        >
          Showroom
        </NuxtLink>
        <NuxtLink
          to="/benchmark"
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-sm text-brand-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
        >
          <UIcon name="i-lucide-gauge" class="size-4 text-brand-500 dark:text-brand-300" />
          Benchmark
        </NuxtLink>
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
        <!-- Docs search (⌘K). The dialog itself is mounted once in the default layout; this only
             toggles its shared open state. ClientOnly because the search index is client-side. -->
        <ClientOnly>
          <UContentSearchButton class="hidden sm:flex" />
          <UContentSearchButton collapsed class="sm:hidden" />
        </ClientOnly>
        <UButton
          to="https://github.com/sponsors/Flo0806"
          target="_blank"
          icon="i-simple-icons-githubsponsors"
          label="Sponsor"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden font-medium text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-600 sm:inline-flex dark:text-rose-400 dark:hover:text-rose-300"
          aria-label="Sponsor jasy"
        />
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
            @click="toggleDark"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <UButton
          to="/docs/pdf"
          label="Get started"
          color="primary"
          size="sm"
          class="ml-1 hidden font-medium sm:inline-flex"
        />
        <UButton
          :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="md:hidden"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMobile"
        />
      </div>
    </div>

    <!-- mobile menu: a dropdown panel below the bar, overlaying the page (md:hidden) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="mobileOpen"
        class="absolute inset-x-0 top-full border-b border-brand-100/70 bg-(--canvas)/95 px-4 py-3 shadow-lg backdrop-blur-md md:hidden dark:border-white/10"
      >
        <NuxtLink
          to="/showroom"
          class="block rounded-md px-3 py-2.5 font-mono text-sm text-brand-900 transition-colors hover:bg-brand-50 dark:text-white dark:hover:bg-white/5"
        >
          Showroom
        </NuxtLink>
        <NuxtLink
          to="/benchmark"
          class="block rounded-md px-3 py-2.5 font-mono text-sm text-brand-900 transition-colors hover:bg-brand-50 dark:text-white dark:hover:bg-white/5"
        >
          Benchmark
        </NuxtLink>
        <NuxtLink
          to="/docs/cli"
          class="block rounded-md px-3 py-2.5 font-mono text-sm text-brand-900 transition-colors hover:bg-brand-50 dark:text-white dark:hover:bg-white/5"
        >
          Docs
        </NuxtLink>
        <NuxtLink
          to="/validate"
          class="flex items-center gap-1.5 rounded-md px-3 py-2.5 font-mono text-sm text-brand-900 transition-colors hover:bg-brand-50 dark:text-white dark:hover:bg-white/5"
        >
          <UIcon name="i-lucide-shield-check" class="size-4 text-brand-500 dark:text-brand-300" />
          Validate
        </NuxtLink>
        <NuxtLink
          to="https://github.com/sponsors/Flo0806"
          target="_blank"
          class="flex items-center gap-1.5 rounded-md px-3 py-2.5 font-mono text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-white/5"
        >
          <UIcon name="i-simple-icons-githubsponsors" class="size-4" />
          Sponsor
        </NuxtLink>
        <NuxtLink
          to="/docs/pdf"
          class="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2.5 font-mono text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-white/5"
        >
          Get started
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
