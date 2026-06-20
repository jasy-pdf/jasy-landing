<script setup lang="ts">
const { data: doc } = await useAsyncData("imprint", () =>
  queryCollection("content").path("/imprint").first(),
);

useHead({ title: "Legal Notice — JasyPDF" });
</script>

<template>
  <UContainer class="py-16 sm:py-20">
    <article v-if="doc" class="legal">
      <ContentRenderer :value="doc" />
    </article>
    <p v-else class="text-(--ui-text-muted)">Page not found.</p>
  </UContainer>
</template>
