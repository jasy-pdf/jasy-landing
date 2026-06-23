// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // vue-pdf-embed bundles pdf.js; transpiling keeps its ESM + worker happy under Vite/Nuxt.
  build: { transpile: ["vue-pdf-embed"] },
});
