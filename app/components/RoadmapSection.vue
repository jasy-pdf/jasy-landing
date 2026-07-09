<script setup lang="ts">
// A curated, ordered view of what's coming - no dates, no version numbers, just the themes in order.
// The full, live roadmap lives on the GitHub project board (linked below).
const items = [
  {
    icon: "i-lucide-shapes",
    title: "Richer layout & styling",
    text: "Gradients, SVG, aspect-ratio, min and max sizes, and the full flexbox model.",
  },
  {
    icon: "i-lucide-book-open",
    title: "Documents that break right",
    text: "Keep-together blocks, orphans and widows, and true multi-column, so a long report never breaks in the wrong place.",
  },
  {
    icon: "i-lucide-type",
    title: "More fonts",
    text: "WOFF fonts, TrueType kerning, and loading a font straight from a URL.",
  },
  {
    icon: "i-lucide-text-cursor-input",
    title: "Forms",
    text: "Fillable AcroForm fields: text, checkboxes, radios and dropdowns.",
  },
  {
    icon: "i-lucide-file-pen",
    title: "Read & edit existing PDFs",
    text: "Open any PDF (even password-protected), edit it, and merge, split or extract pages.",
  },
  {
    icon: "i-lucide-receipt",
    title: "Deeper e-invoicing & signatures",
    text: "More Factur-X / ZUGFeRD profiles, Peppol, further country formats, and digital signatures.",
  },
];
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <p class="spec-label text-brand-600 dark:text-brand-300">
        roadmap <span class="text-brand-400">·</span> MIT
        <span class="text-brand-400">·</span> built in the open
      </p>
      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        We're just getting started.
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        Built in the open, MIT-licensed. Here's where jasy is headed - the plan, in order, no dates
        promised.
      </p>

      <ul class="mt-12 max-w-3xl divide-y divide-brand-100 dark:divide-white/10">
        <li
          v-for="item in items"
          :key="item.title"
          class="group flex items-start gap-5 py-6 first:pt-0 last:pb-0"
        >
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
          >
            <UIcon :name="item.icon" class="size-6" />
          </div>
          <div>
            <h3 class="font-display text-xl font-bold text-brand-900 dark:text-white">
              {{ item.title }}
            </h3>
            <p class="mt-1 leading-relaxed text-brand-900/65 dark:text-white/60">{{ item.text }}</p>
          </div>
        </li>
      </ul>

      <div class="mt-12 flex flex-wrap items-center gap-3">
        <UButton
          to="https://github.com/jasy-pdf/jasy"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="outline"
          size="lg"
          class="font-medium"
        >
          Follow on GitHub
        </UButton>
        <UButton
          to="https://github.com/orgs/jasy-pdf/projects/1"
          target="_blank"
          icon="i-lucide-list-checks"
          color="neutral"
          variant="ghost"
          size="lg"
          class="font-medium"
        >
          See the full board
        </UButton>
        <span class="font-mono text-sm text-brand-900/55 dark:text-white/50">
          Issues, ideas and PRs welcome.
        </span>
      </div>
    </div>
  </section>
</template>
