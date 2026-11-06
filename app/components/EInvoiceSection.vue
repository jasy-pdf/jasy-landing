<script setup lang="ts">
// The e-invoicing story. The results on the right are the real ones: this exact invoice was rendered and
// run through `jasy validate` (KoSIT EN 16931 rules + veraPDF). Re-check them when the code changes.
const code = `import { renderZugferd, type Invoice } from "@jasy/e-invoice";

const invoice: Invoice = {
  number: "INV-2027-001",
  issueDate: "2027-01-15",
  currency: "EUR",
  dueDate: "2027-01-29",
  seller: {
    name: "Northwind GmbH",
    vatId: "DE265013614",
    address: { line1: "Hauptstrasse 1", city: "Berlin", postCode: "10115", country: "DE" },
    contact: { name: "A. Schmidt", email: "billing@northwind.de", phone: "+49 30 123456" },
  },
  buyer: {
    name: "Globex AG",
    address: { line1: "Marktplatz 5", city: "Munich", postCode: "80331", country: "DE" },
  },
  lines: [{ name: "Consulting", quantity: 8, unit: "HUR", netUnitPrice: 120,
            vat: { category: "S", ratePercent: 19 } }],
  payment: { iban: "DE89370400440532013000", terms: "Payable within 14 days." },
};

const { bytes, xml } = await renderZugferd(invoice, { locale: "en" });`;

const checks = [
  { label: "EN 16931 business rules", sub: "KoSIT", result: "0 errors · 0 warnings" },
  { label: "PDF/A-3 structure", sub: "Factur-X XMP, sRGB, embedded XML", result: "13 of 13" },
  { label: "veraPDF", sub: "PDF/A-3b profile", result: "0 failed rules" },
];

const points = [
  {
    icon: "i-lucide-calculator",
    title: "Totals by construction",
    text: "Line nets, totals and the VAT breakdown are computed from your data - nothing typed twice, nothing off by a cent.",
  },
  {
    icon: "i-lucide-files",
    title: "ZUGFeRD, XRechnung, Factur-X",
    text: "PDF/A-3 with the EN 16931 XML inside, or the XML alone - CII or UBL, one switch.",
  },
  {
    icon: "i-lucide-server-off",
    title: "Your data stays home",
    text: "No service, no upload, no Java. It runs in your Node process, next to your data.",
  },
];
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-center gap-3">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          @jasy/e-invoice · XRechnung · ZUGFeRD · Factur-X
        </p>
        <span
          class="spec-label rounded-full bg-accent-400/15 px-2.5 py-1 text-brand-700 ring-1 ring-inset ring-accent-400/40 dark:text-accent-300"
          >Germany: mandatory from 2027</span
        >
      </div>

      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        E-invoices that pass the
        <span class="relative whitespace-nowrap">
          official checks
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
          </svg> </span
        >.
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        One typed object in, a conformant e-invoice out: the PDF a person reads and the EN 16931
        data a machine reads. Java has Mustangproject, PHP has horstoeko/zugferd, Python has
        factur-x - this is the TypeScript answer.
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink
          to="/docs/invoicing"
          class="group inline-flex items-center gap-1.5 font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          Read the e-invoicing guide
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
        <NuxtLink
          to="/de/e-rechnung"
          class="font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
          lang="de"
        >
          Auf Deutsch: die E-Rechnungspflicht erklärt
        </NuxtLink>
        <code
          class="rounded bg-brand-50 px-2 py-1 font-mono text-sm text-brand-700 dark:bg-white/10 dark:text-brand-200"
          >pnpm add @jasy/e-invoice</code
        >
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
        <div
          class="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div
            class="flex items-center gap-2 border-b border-brand-100 px-4 py-2.5 dark:border-white/10"
          >
            <UIcon name="i-lucide-file-code" class="size-4 text-brand-400 dark:text-brand-300" />
            <span class="font-mono text-xs text-brand-600 dark:text-brand-300">invoice.ts</span>
          </div>
          <pre
            class="overflow-x-auto bg-brand-900 p-5 font-mono text-[0.78rem] leading-relaxed text-white/90 dark:bg-black/30"
          ><code>{{ code }}</code></pre>
        </div>

        <div class="space-y-6">
          <div
            class="rounded-2xl border border-brand-200/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p class="spec-label text-brand-600 dark:text-brand-300">$ jasy validate invoice.pdf</p>
            <p class="mt-2 font-display text-lg font-bold text-brand-900 dark:text-white">
              ZUGFeRD · EN 16931 (CII) - valid
            </p>
            <ul class="mt-4 space-y-3">
              <li v-for="c in checks" :key="c.label" class="flex items-start gap-3">
                <UIcon
                  name="i-lucide-badge-check"
                  class="mt-0.5 size-5 shrink-0 text-emerald-600"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-brand-900 dark:text-white">{{ c.label }}</p>
                  <p class="text-xs text-brand-900/55 dark:text-white/50">{{ c.sub }}</p>
                </div>
                <span class="font-mono text-xs text-emerald-700 dark:text-emerald-400">{{
                  c.result
                }}</span>
              </li>
            </ul>
            <UButton
              to="/validate"
              color="primary"
              variant="outline"
              icon="i-lucide-shield-check"
              label="Check your own invoice"
              class="mt-5 w-full justify-center font-medium"
            />
          </div>

          <ul class="space-y-5">
            <li v-for="p in points" :key="p.title" class="flex items-start gap-4">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10"
              >
                <UIcon :name="p.icon" class="size-5" />
              </div>
              <div>
                <h3 class="font-display font-bold text-brand-900 dark:text-white">{{ p.title }}</h3>
                <p class="mt-0.5 text-sm leading-relaxed text-brand-900/65 dark:text-white/60">
                  {{ p.text }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
