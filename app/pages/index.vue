<script setup lang="ts">
const title = "jasy - PDFs and XRechnung / ZUGFeRD e-invoices in TypeScript";
const description =
  "Declarative PDFs - in Node or the browser, as functions, Vue or React components - and conformant XRechnung / ZUGFeRD e-invoices, checked with KoSIT and veraPDF. Pure TypeScript, no headless browser, no Java.";
useHead({ title });
useSeoMeta({ description, ogTitle: title, ogDescription: description, twitterTitle: title });
</script>

<template>
  <HeroSection />
  <EInvoiceSection />
  <TrustSection />
  <ServerBrowserSection />
  <VueSection />
  <NuxtSection />
  <ReactSection />
  <RoadmapSection />
</template>
