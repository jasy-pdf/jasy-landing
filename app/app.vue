<script setup lang="ts">
// Site-wide SEO + social + structured data. Per-page `useHead`/`useSeoMeta` overrides the title and
// description; everything else (the OG image, card, canonical, JSON-LD) is set once here.
const site = "https://jasy.dev";
const route = useRoute();
const canonical = computed(() => site + route.path);

useHead({
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "canonical", href: canonical },
    { rel: "icon", type: "image/svg+xml", href: "/img/jasy-logo-final.svg" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "jasy",
        alternateName: "JasyPDF",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Node.js",
        description:
          "Declarative, component-based PDF generation in pure TypeScript. ZUGFeRD & XRechnung e-invoices built in, real pagination, embeddable custom fonts - no headless browser, no Java.",
        url: site,
        image: `${site}/img/og.png`,
        license: "https://opensource.org/licenses/MIT",
        programmingLanguage: "TypeScript",
        codeRepository: "https://github.com/jasy-pdf/jasy",
        author: { "@type": "Person", name: "Florian Heuberger" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        keywords:
          "PDF, TypeScript, Node.js, ZUGFeRD, XRechnung, Factur-X, e-invoice, EN 16931, PDF generation, PDF/A-3",
      }),
    },
  ],
});

useSeoMeta({
  ogSiteName: "jasy",
  ogType: "website",
  ogUrl: canonical,
  ogImage: `${site}/img/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "jasypdf - Create PDFs easier than ever",
  twitterCard: "summary_large_image",
  twitterImage: `${site}/img/og.png`,
  // Defaults; pages set their own title + description.
  ogTitle: "jasy - Create PDFs easier than ever",
  ogDescription:
    "Declarative PDFs in pure TypeScript. ZUGFeRD & XRechnung built in. No headless browser, no Java.",
  twitterTitle: "jasy - Create PDFs easier than ever",
  twitterDescription:
    "Declarative PDFs in pure TypeScript. ZUGFeRD & XRechnung built in. No headless browser, no Java.",
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
