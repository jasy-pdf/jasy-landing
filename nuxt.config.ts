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

  modules: ["@nuxt/ui", "@nuxt/content"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // vue-pdf-embed bundles pdf.js; transpiling keeps its ESM + worker happy under Vite/Nuxt.
  build: { transpile: ["vue-pdf-embed"] },
});
