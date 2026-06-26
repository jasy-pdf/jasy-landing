<script setup lang="ts">
useHead({
  title: "Validate your e-invoice - jasy",
  meta: [
    {
      name: "description",
      content:
        "Check any ZUGFeRD or XRechnung invoice against the official validators (veraPDF + EN 16931), right in your browser. Don't trust us - verify it yourself.",
    },
  ],
});

const authorities = [
  { label: "veraPDF", sub: "ISO 19005 / PDF-A" },
  { label: "EN 16931", sub: "KoSIT rules" },
];
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-368 px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div class="mx-auto max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          free validator <span class="text-brand-400">·</span> official tools
          <span class="text-brand-400">·</span> nothing stored
        </p>

        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          Don't trust us.
          <span class="relative whitespace-nowrap">
            Verify it
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
          yourself.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          jasy generates ZUGFeRD and XRechnung e-invoices in pure TypeScript. You shouldn't take our
          word that they're conformant, so don't. Drop in
          <span class="font-medium text-brand-900 dark:text-white">any</span> e-invoice below, made
          by any tool, and check it against the same validators a tax office uses.
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
            This is the exact check jasy runs on every invoice it generates. Build conformant
            e-invoices in pure TypeScript.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-2.5">
            <UButton
              to="/docs/invoicing"
              color="primary"
              variant="outline"
              icon="i-lucide-book-open"
              label="Read the docs"
              class="font-medium"
            />
            <UButton
              to="https://github.com/jasy-pdf"
              target="_blank"
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-github"
              label="The validator is open source"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
