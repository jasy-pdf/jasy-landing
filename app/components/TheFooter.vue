<script setup lang="ts">
const year = 2026;

// `soon` items are previews of sections/links that ship later — rendered as labels, not links.
// Only GitHub and the legal pages are live links for now.
type FooterLink = { label: string; to?: string; external?: boolean; soon?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", soon: true },
      { label: "E-Invoicing", soon: true },
      { label: "Engine", soon: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", to: "https://github.com/jasy-pdf", external: true },
      { label: "Docs", soon: true },
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
              <span
                v-if="link.soon"
                class="inline-flex items-center gap-1.5 text-sm text-brand-900/40 dark:text-white/35"
              >
                {{ link.label }}
                <span
                  class="rounded bg-brand-100 px-1 py-px font-mono text-[9px] uppercase tracking-wide text-brand-500 dark:bg-white/10 dark:text-brand-300"
                  >soon</span
                >
              </span>
              <NuxtLink
                v-else
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
