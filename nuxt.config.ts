// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // The showroom and benchmark sources are shown as TEXT (imported with `?raw`). They import
  // @jasy/pdf and react, which this site does not install, so type-checking them reports modules that
  // were never meant to resolve here - noise that hides a real error elsewhere.
  typescript: {
    tsConfig: {
      exclude: ["../app/showroom-sources/**", "../app/benchmark-sources/**"],
    },
  },

  modules: ["@nuxt/ui", "@nuxt/content", "@nuxtjs/i18n"],
  // English is the default and keeps its unprefixed URLs; other languages live under /de, /fr, ...
  // A page exists in a language only when it says so (definePageMeta i18n.locales) - an untranslated
  // page must not get a /de copy with English text. scripts/seo.mjs refuses a page that declares none.
  i18n: {
    baseUrl: "https://jasy.dev",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    customRoutes: "meta",
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "de", language: "de-DE", name: "Deutsch", file: "de.json" },
    ],
    // No redirect by browser language: a crawler and a shared link get exactly the URL they asked for.
    detectBrowserLanguage: false,
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // vue-pdf-embed bundles pdf.js; transpiling keeps its ESM + worker happy under Vite/Nuxt.
  build: { transpile: ["vue-pdf-embed"] },
});
