<script setup lang="ts">
definePageMeta({ i18n: { locales: ["en", "de"] } });

const { t } = useI18n();
const title = computed(() => t("home.title"));
const description = computed(() => t("home.description"));
useHead({ title });
useSeoMeta({ description, ogTitle: title, ogDescription: description, twitterTitle: title });
</script>

<template>
  <HeroSection />
  <FrameworksSection />
  <EInvoiceSection />
  <TrustSection />
  <ServerBrowserSection />
  <VueSection />
  <NuxtSection />
  <ReactSection />
  <AngularSection />
  <RoadmapSection />
</template>
