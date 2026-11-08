<script setup lang="ts">
// Global docs search (⌘K). Loaded client-side only so it never weighs on SSR; the trigger lives in
// the header and shares its open state with this dialog via Nuxt UI's useContentSearch.
// Both follow the current language, so a German reader searches the German docs.
const { locale } = useI18n();
const localePath = useLocalePath();
const { data: searchFiles } = useLazyAsyncData(
  () => `search-files:${locale.value}`,
  () => loadDocsSearch(locale.value, localePath),
  { server: false },
);
const { data: searchNav } = useLazyAsyncData(
  () => `search-nav:${locale.value}`,
  () => loadDocsNav(locale.value, localePath),
  { server: false },
);
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
    <CookieNotice />

    <ClientOnly>
      <LazyUContentSearch :files="searchFiles ?? []" :navigation="searchNav ?? []" />
    </ClientOnly>
  </div>
</template>
