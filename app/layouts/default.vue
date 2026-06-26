<script setup lang="ts">
// Global docs search (⌘K). Loaded client-side only so it never weighs on SSR; the trigger lives in
// the header and shares its open state with this dialog via Nuxt UI's useContentSearch.
const { data: searchFiles } = useLazyAsyncData(
  "search-files",
  () => queryCollectionSearchSections("docs"),
  { server: false },
);
const { data: searchNav } = useLazyAsyncData(
  "search-nav",
  () => queryCollectionNavigation("docs"),
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
