<script setup lang="ts">
// The German twin of /validate (hreflang pair): the same widget, the copy for German search.
const title = "E-Rechnung prüfen: XRechnung und ZUGFeRD kostenlos validieren";
const description =
  "Prüfen Sie jede XRechnung und ZUGFeRD-Rechnung kostenlos gegen die EN-16931-Regeln der KoSIT und veraPDF - aus jedem Programm. Die Datei wird geprüft und sofort gelöscht.";
useHead({
  title,
  htmlAttrs: { lang: "de" },
  link: [
    { rel: "alternate", hreflang: "de", href: "https://jasy.dev/de/e-rechnung-pruefen" },
    { rel: "alternate", hreflang: "en", href: "https://jasy.dev/validate" },
    { rel: "alternate", hreflang: "x-default", href: "https://jasy.dev/validate" },
  ],
});
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  ogLocale: "de_DE",
  twitterTitle: title,
  twitterDescription: description,
});

const authorities = [
  { label: "veraPDF", sub: "ISO 19005 / PDF-A" },
  { label: "EN 16931", sub: "KoSIT-Regeln" },
];
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-368 px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div class="mx-auto max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          kostenlos <span class="text-brand-400">·</span> offizielle Regeln
          <span class="text-brand-400">·</span> nichts gespeichert
        </p>

        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          E-Rechnung
          <span class="relative whitespace-nowrap">
            prüfen
            <svg
              class="absolute -bottom-1.5 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 7 C 60 2, 140 2, 198 6"
                stroke="#f3dc29"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </span>
          - in Sekunden.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          Legen Sie eine XRechnung oder ZUGFeRD-Rechnung ab -
          <span class="font-medium text-brand-900 dark:text-white">aus jedem Programm</span>. Sie
          wird gegen die EN-16931-Geschäftsregeln der KoSIT und gegen veraPDF geprüft, den
          Referenz-Validator für PDF/A. Die Datei wird geprüft und sofort gelöscht.
        </p>

        <ul class="mt-6 flex flex-wrap gap-2.5">
          <li
            v-for="a in authorities"
            :key="a.label"
            class="inline-flex items-baseline gap-2 rounded-full border border-brand-200/80 bg-white/60 px-3.5 py-1.5 dark:border-white/10 dark:bg-white/5"
          >
            <span class="text-sm font-semibold text-brand-800 dark:text-brand-100">{{
              a.label
            }}</span>
            <span class="spec-label text-brand-400">{{ a.sub }}</span>
          </li>
        </ul>

        <div class="mt-9">
          <ValidatorWidget />
        </div>

        <div class="mt-10 border-t border-brand-200/60 pt-7 dark:border-white/10">
          <p class="text-brand-900/70 dark:text-white/65">
            Genau diese Prüfung läuft auf jeder Rechnung, die jasy erzeugt. Was die
            E-Rechnungspflicht ab 2025, 2027 und 2028 verlangt, steht in unserem
            <NuxtLink
              to="/de/e-rechnung"
              class="font-medium text-brand-700 underline dark:text-brand-300"
              >Überblick zur E-Rechnung</NuxtLink
            >.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-2.5">
            <UButton
              to="/docs/invoicing"
              color="primary"
              variant="outline"
              icon="i-lucide-book-open"
              label="Dokumentation (englisch)"
              class="font-medium"
            />
            <UButton
              to="https://github.com/jasy-pdf"
              target="_blank"
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-github"
              label="Der Prüfdienst ist Open Source"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
