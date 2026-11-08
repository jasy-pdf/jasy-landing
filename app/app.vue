<script setup lang="ts">
import { de, en } from "@nuxt/ui/locale";

// Site-wide SEO + social + structured data. Per-page `useHead`/`useSeoMeta` overrides the title and
// description; everything else (the OG image, card, JSON-LD) is set once here.
const site = "https://jasy.dev";
const route = useRoute();
const pageUrl = computed(() => site + route.path);

// lang, the canonical URL, hreflang alternates and og:locale come from i18n - per page and per locale,
// only for the languages a page really exists in.
const i18nHead = useLocaleHead({ seo: true });
const pageLocales = usePageLocales();
const { locale, defaultLocale } = useI18n();
useHead(() => {
  let link = i18nHead.value.link ?? [];
  const only = pageLocales.value[route.path];
  if (only) {
    const lang = (l: { hreflang?: unknown }) => String(l.hreflang ?? "").split("-")[0]!;
    const own = link.find((l) => l.hreflang === defaultLocale)?.href;
    link = link
      .filter((l) => !l.hreflang || l.hreflang === "x-default" || only.includes(lang(l)))
      .map((l) =>
        l.rel === "canonical" && !only.includes(locale.value) ? { ...l, href: own } : l,
      );
  }
  // The module lists every configured language as og:locale:alternate; keep only those this page has.
  const languages = new Set(link.map((l) => String(l.hreflang ?? "")).filter(Boolean));
  const meta = (i18nHead.value.meta ?? []).filter(
    (m) =>
      m.property !== "og:locale:alternate" || languages.has(String(m.content).replace("_", "-")),
  );
  return {
    htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang, dir: i18nHead.value.htmlAttrs?.dir },
    link: [...link],
    meta,
  };
});

useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: "/img/jasy-logo-final.svg" }],
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
  ogUrl: pageUrl,
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

// Nuxt UI's own strings (the search dialog, its button) in the page's language.
const uiLocale = computed(() => ({ de, en })[locale.value as "de" | "en"] ?? en);
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
