<script setup lang="ts">
const year = 2026;

type FooterLink = { label: string; to: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Showroom", to: "/showroom" },
      { label: "Validate", to: "/validate" },
      { label: "Docs", to: "/docs/pdf" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "CLI", to: "/docs/cli" },
      { label: "GitHub", to: "https://github.com/jasy-pdf", external: true },
      { label: "npmx", to: "https://npmx.dev/package/@jasy/pdf", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Imprint", to: "/imprint" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];
</script>

<template>
  <footer class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-14 sm:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div class="max-w-xs">
          <div class="flex items-center gap-2.5">
            <img src="/img/jasy-logo-final.svg" alt="" class="h-7 w-auto" />
            <span
              class="font-mono text-base font-semibold tracking-tight text-brand-900 dark:text-white"
            >
              jasy<span class="text-brand-600 dark:text-brand-300">pdf</span>
            </span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-brand-900/60 dark:text-white/55">
            Declarative PDFs in pure TypeScript. ZUGFeRD &amp; XRechnung compliant, with no headless
            browser and no Java.
          </p>
        </div>

        <div v-for="col in columns" :key="col.title">
          <h3 class="spec-label text-brand-500 dark:text-brand-300">{{ col.title }}</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink
                :to="link.to"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="text-sm text-brand-900/70 transition-colors hover:text-brand-600 dark:text-white/60 dark:hover:text-brand-300"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-brand-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
      >
        <p class="font-mono text-xs text-brand-900/50 dark:text-white/45">
          © {{ year }} Florian Heuberger · MIT License
        </p>
        <p class="font-mono text-xs text-brand-900/50 dark:text-white/45">
          Built with Nuxt · self-hosted fonts · no trackers
        </p>
      </div>
    </div>
  </footer>
</template>
