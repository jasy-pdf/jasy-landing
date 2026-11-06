<script setup lang="ts">
// "Why trust it" - every claim links to where it is proven. No hard-coded numbers: the benchmark page
// computes its own, and a figure copied here would go stale.
const proofs = [
  {
    icon: "i-lucide-cpu",
    title: "An engine of its own",
    text: "Layout, text shaping and the PDF writer are ours, in TypeScript. No Chromium, no Java, no pdf-lib underneath.",
    to: "/docs/pdf",
    link: "How it works",
  },
  {
    icon: "i-lucide-zap",
    title: "Faster than react-pdf",
    text: "Six documents against react-pdf, pdfmake and jsPDF - same text, same pages, harness in the repo.",
    to: "/benchmark",
    link: "See the measurements",
  },
  {
    icon: "i-lucide-shield-check",
    title: "Checked, not claimed",
    text: "E-invoices pass the KoSIT EN 16931 rules and veraPDF. Check any file yourself - ours or anyone's.",
    to: "/validate",
    link: "Open the validator",
  },
  {
    icon: "i-lucide-accessibility",
    title: "Accessible PDFs",
    text: "One flag emits a tagged PDF/UA-1 document that passes veraPDF's machine checks.",
    to: "/docs/pdf/accessibility",
    link: "Accessibility",
  },
  {
    icon: "i-lucide-binary",
    title: "Byte-stable output",
    text: "The same document renders to the same bytes, every time - an archived invoice stays reproducible.",
    to: "/docs/pdf/output",
    link: "Output options",
  },
  {
    icon: "i-lucide-globe",
    title: "Anywhere JavaScript runs",
    text: "Node or the browser, plain TypeScript, Vue, React or Nuxt - the same engine underneath.",
    to: "/docs",
    link: "All guides",
  },
];
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <p class="spec-label text-brand-600 dark:text-brand-300">why trust it</p>
      <h2
        class="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        Every claim on this page links to its proof.
      </h2>
      <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="p in proofs"
          :key="p.title"
          class="group flex flex-col rounded-2xl border border-brand-200/70 bg-white/70 p-6 shadow-sm transition-colors hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
        >
          <div
            class="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10"
          >
            <UIcon :name="p.icon" class="size-5" />
          </div>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-900 dark:text-white">
            {{ p.title }}
          </h3>
          <p class="mt-1.5 flex-1 text-sm leading-relaxed text-brand-900/65 dark:text-white/60">
            {{ p.text }}
          </p>
          <NuxtLink
            :to="p.to"
            class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
          >
            {{ p.link }}
            <UIcon
              name="i-lucide-arrow-right"
              class="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
