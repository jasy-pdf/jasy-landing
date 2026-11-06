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
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${site}/#org`,
            name: "jasy",
            url: site,
            logo: `${site}/img/jasy-logo-final.svg`,
            sameAs: ["https://github.com/jasy-pdf/jasy", "https://www.npmjs.com/org/jasy"],
          },
          {
            "@type": "WebSite",
            "@id": `${site}/#website`,
            name: "jasy",
            url: site,
            publisher: { "@id": `${site}/#org` },
            inLanguage: ["en", "de"],
          },
          {
            "@type": "SoftwareApplication",
            name: "jasy",
            alternateName: "JasyPDF",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Node.js, Web browser",
            description:
              "Declarative PDFs in pure TypeScript - as functions, Vue components or React components, in Node or the browser - and conformant ZUGFeRD / XRechnung e-invoices in Node: EN 16931 XML and PDF/A-3 from one typed object, checked with the KoSIT rules and veraPDF. No headless browser, no Java.",
            url: site,
            image: `${site}/img/og.png`,
            license: "https://opensource.org/licenses/MIT",
            programmingLanguage: "TypeScript",
            codeRepository: "https://github.com/jasy-pdf/jasy",
            author: { "@type": "Person", name: "Florian Heuberger" },
            publisher: { "@id": `${site}/#org` },
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            keywords:
              "XRechnung, ZUGFeRD, Factur-X, E-Rechnung, e-invoice, EN 16931, PDF/A-3, PDF generation, TypeScript, Node.js, React, Vue, Nuxt",
          },
        ],
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
  ogImageAlt: "jasy - PDFs and XRechnung / ZUGFeRD e-invoices in TypeScript",
  twitterCard: "summary_large_image",
  twitterImage: `${site}/img/og.png`,
  // Defaults; pages set their own title + description.
  ogTitle: "jasy - PDFs and XRechnung / ZUGFeRD e-invoices in TypeScript",
  ogDescription:
    "Declarative PDFs in Node or the browser, for Vue, React or Nuxt - and conformant XRechnung / ZUGFeRD e-invoices. Pure TypeScript, no headless browser, no Java.",
  twitterTitle: "jasy - PDFs and XRechnung / ZUGFeRD e-invoices in TypeScript",
  twitterDescription:
    "Declarative PDFs in Node or the browser, for Vue, React or Nuxt - and conformant XRechnung / ZUGFeRD e-invoices. Pure TypeScript, no headless browser, no Java.",
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
