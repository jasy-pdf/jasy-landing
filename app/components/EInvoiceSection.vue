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

const { t } = useI18n();
const to = useLocalizedTo();
const checks = computed(() => [
  { label: t("home.einvoice.check1"), sub: "KoSIT", result: t("home.einvoice.check1Result") },
  {
    label: t("home.einvoice.check2"),
    sub: t("home.einvoice.check2Sub"),
    result: t("home.einvoice.check2Result"),
  },
  { label: "veraPDF", sub: t("home.einvoice.check3Sub"), result: t("home.einvoice.check3Result") },
]);

const points = computed(() => [
  {
    icon: "i-lucide-calculator",
    title: t("home.einvoice.p1Title"),
    text: t("home.einvoice.p1Text"),
  },
  { icon: "i-lucide-files", title: t("home.einvoice.p2Title"), text: t("home.einvoice.p2Text") },
  {
    icon: "i-lucide-server-off",
    title: t("home.einvoice.p3Title"),
    text: t("home.einvoice.p3Text"),
  },
]);
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
          >{{ t("home.einvoice.mandate") }}</span
        >
      </div>

      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        {{ t("home.einvoice.h2Before") }}
        <span class="relative whitespace-nowrap">
          {{ t("home.einvoice.h2Highlight")
          }}<svg
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
            /></svg></span
        >{{ t("home.einvoice.h2After") }}
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        {{ t("home.einvoice.lead") }}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink
          :to="to('/docs/invoicing')"
          class="group inline-flex items-center gap-1.5 font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          {{ t("home.einvoice.guide") }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
        <NuxtLink
          :to="to('/e-rechnung')"
          class="font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          {{ t("home.einvoice.german") }}
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
              ZUGFeRD · EN 16931 (CII) - {{ t("home.einvoice.valid") }}
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
              :to="to('/validate')"
              color="primary"
              variant="outline"
              icon="i-lucide-shield-check"
              :label="t('home.einvoice.own')"
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
