<script setup lang="ts">
const { data: doc } = await useAsyncData("privacy", () =>
  queryCollection("content").path("/privacy").first(),
);

useHead({ title: "Privacy Policy — JasyPDF" });
</script>

<template>
  <UContainer class="py-16 sm:py-20">
    <article v-if="doc" class="legal">
      <ContentRenderer :value="doc" />
    </article>
    <p v-else class="text-muted">Page not found.</p>
  </UContainer>
</template>
