<script setup lang="ts">
// One page in two languages at the German search term: /e-rechnung and /de/e-rechnung.
definePageMeta({ i18n: { locales: ["en", "de"] } });

// Pillar page for the German B2B e-invoice mandate. Every legal statement here is taken from the norm it
// links (UStG, UStDV on gesetze-im-internet.de) - change the text only against the norm, never from memory.
const { t, locale } = useI18n();
const localizedTo = useLocalizedTo();
const title = computed(() => t("erechnung.title"));
const description = computed(() => t("erechnung.description"));
const updated = "2026-11-06";

const timeline = computed(() =>
  ["receive", "all", "small", "issue"].map((k) => ({
    date: t(`erechnung.timeline.${k}Date`),
    title: t(`erechnung.timeline.${k}Title`),
    text: t(`erechnung.timeline.${k}Text`),
  })),
);

const formats = computed(() =>
  (
    [
      ["XRechnung", "xrechnung"],
      ["ZUGFeRD / Factur-X", "zugferd"],
    ] as const
  ).map(([name, k]) => ({
    name,
    what: t(`erechnung.formats.${k}What`),
    when: t(`erechnung.formats.${k}When`),
  })),
);

const faq = computed(() =>
  ["pdf", "issue", "receive", "format", "exempt", "valid"].map((k) => ({
    q: t(`erechnung.faq.${k}Q`),
    a: t(`erechnung.faq.${k}A`),
  })),
);

const sources = computed(() =>
  (
    [
      ["s14", "https://www.gesetze-im-internet.de/ustg_1980/__14.html"],
      ["s27", "https://www.gesetze-im-internet.de/ustg_1980/__27.html"],
      ["s33", "https://www.gesetze-im-internet.de/ustdv_1980/__33.html"],
      ["s34", "https://www.gesetze-im-internet.de/ustdv_1980/__34.html"],
    ] as const
  ).map(([k, href]) => ({ label: t(`erechnung.sources.${k}`), href })),
);

const c = (key: string) => t(`erechnung.code.${key}`);
const code = computed(
  () => `import { writeFileSync } from "node:fs";
import { renderZugferd, type Invoice } from "@jasy/e-invoice";

const ${c("var")}: Invoice = {
  number: "RE-2027-001",
  issueDate: "2027-01-15",
  currency: "EUR",
  dueDate: "2027-01-29",
  seller: {
    name: "Muster GmbH",
    vatId: "DE265013614",
    address: { line1: "Hauptstraße 1", city: "Berlin", postCode: "10115", country: "DE" },
    contact: { name: "A. Schmidt", email: "rechnung@muster.de", phone: "+49 30 123456" },
  },
  buyer: {
    name: "Beispiel AG",
    address: { line1: "Marktplatz 5", city: "München", postCode: "80331", country: "DE" },
  },
  lines: [
    { name: "${c("consulting")}", quantity: 8, unit: "HUR", netUnitPrice: 120,
      vat: { category: "S", ratePercent: 19 } },
    { name: "${c("license")}", quantity: 1, unit: "C62", netUnitPrice: 480,
      vat: { category: "S", ratePercent: 19 } },
  ],
  payment: { iban: "DE89370400440532013000", terms: "${c("terms")}" },
};

const { bytes, xml } = await renderZugferd(${c("var")});
writeFileSync("${c("var")}.pdf", bytes); // ${c("pdf")}
writeFileSync("${c("var")}.xml", xml); // ${c("xml")}`,
);

const pageUrl = computed(
  () => `https://jasy.dev${locale.value === "de" ? "/de/e-rechnung" : "/e-rechnung"}`,
);
useHead({
  title,
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: title.value,
              description: description.value,
              inLanguage: locale.value === "de" ? "de-DE" : "en-US",
              dateModified: updated,
              author: { "@type": "Person", name: "Florian Heuberger" },
              publisher: { "@type": "Organization", name: "jasy", url: "https://jasy.dev" },
              mainEntityOfPage: pageUrl.value,
              about: ["E-Rechnung", "XRechnung", "ZUGFeRD", "EN 16931"],
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.value.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      ),
    },
  ],
});
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
});
</script>

<template>
  <article class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-368 px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <header class="mx-auto max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          E-Rechnung <span class="text-brand-400">·</span> XRechnung
          <span class="text-brand-400">·</span> ZUGFeRD
        </p>
        <h1
          class="mt-5 font-display text-[2.2rem] font-bold leading-[1.08] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          {{ t("erechnung.h1") }}
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          {{ t("erechnung.lead") }}
        </p>
        <p class="mt-3 text-sm text-brand-900/50 dark:text-white/40">
          {{ t("erechnung.asOf") }}
        </p>
      </header>

      <section class="mx-auto mt-14 max-w-5xl" aria-labelledby="zeitplan">
        <h2
          id="zeitplan"
          class="font-display text-2xl font-bold text-brand-900 sm:text-3xl dark:text-white"
        >
          {{ t("erechnung.timelineH2") }}
        </h2>
        <ol class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="step in timeline"
            :key="step.date"
            class="rounded-2xl border border-brand-200/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p class="spec-label text-brand-600 dark:text-brand-300">{{ step.date }}</p>
            <h3 class="mt-2 font-display text-lg font-bold text-brand-900 dark:text-white">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
              {{ step.text }}
            </p>
          </li>
        </ol>
      </section>

      <div class="mx-auto mt-16 max-w-3xl space-y-14">
        <section aria-labelledby="was">
          <h2 id="was" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.whatH2") }}
          </h2>
          <p class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70">
            {{ t("erechnung.whatText") }}
          </p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div
              v-for="f in formats"
              :key="f.name"
              class="rounded-2xl border border-brand-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
            >
              <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
                {{ f.name }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
                {{ f.what }}
              </p>
              <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
                {{ f.when }}
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="ausnahmen">
          <h2 id="ausnahmen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.exemptH2") }}
          </h2>
          <ul
            class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-brand-900/75 dark:text-white/70"
          >
            <li v-for="n in 4" :key="n">{{ t(`erechnung.exempt${n}`) }}</li>
          </ul>
        </section>

        <section aria-labelledby="erzeugen">
          <h2 id="erzeugen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.createH2") }}
          </h2>
          <i18n-t
            keypath="erechnung.createText"
            tag="p"
            scope="global"
            class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70"
          >
            <template #pkg
              ><code class="font-mono text-brand-700 dark:text-brand-200"
                >@jasy/e-invoice</code
              ></template
            >
          </i18n-t>
          <div
            class="mt-6 overflow-hidden rounded-2xl border border-brand-200/70 shadow-sm dark:border-white/10"
          >
            <div
              class="flex items-center justify-between gap-3 border-b border-brand-100 bg-white/70 px-4 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <span class="font-mono text-xs text-brand-600 dark:text-brand-300">{{
                c("file")
              }}</span>
              <code class="font-mono text-xs text-brand-500 dark:text-brand-300"
                >pnpm add @jasy/e-invoice</code
              >
            </div>
            <pre
              class="overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
            ><code>{{ code }}</code></pre>
          </div>
          <i18n-t
            keypath="erechnung.createPasses"
            tag="p"
            scope="global"
            class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70"
          >
            <template #call
              ><code class="font-mono text-brand-700 dark:text-brand-200"
                >renderZugferd({{ c("var") }}, { profile: "xrechnung" })</code
              ></template
            >
          </i18n-t>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <UButton
              :to="localizedTo('/docs/invoicing')"
              color="primary"
              icon="i-lucide-book-open"
              :label="t('erechnung.docs')"
            />
            <UButton
              :to="localizedTo('/docs/invoicing/profiles')"
              color="neutral"
              variant="outline"
              :label="t('erechnung.profiles')"
            />
          </div>
        </section>

        <section aria-labelledby="pruefen">
          <h2 id="pruefen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.checkH2") }}
          </h2>
          <i18n-t
            keypath="erechnung.checkText"
            tag="p"
            scope="global"
            class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70"
          >
            <template #cmd
              ><code class="font-mono text-brand-700 dark:text-brand-200"
                >jasy validate {{ c("var") }}.pdf</code
              ></template
            >
          </i18n-t>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <UButton
              :to="localizedTo('/validate')"
              color="primary"
              icon="i-lucide-shield-check"
              :label="t('erechnung.checkNow')"
            />
            <UButton
              :to="localizedTo('/docs/cli')"
              color="neutral"
              variant="outline"
              :label="t('erechnung.cli')"
            />
          </div>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.faqH2") }}
          </h2>
          <div class="mt-5 divide-y divide-brand-100 dark:divide-white/10">
            <details v-for="f in faq" :key="f.q" class="group py-4">
              <summary
                class="cursor-pointer list-none font-semibold text-brand-900 marker:hidden dark:text-white"
              >
                {{ f.q }}
              </summary>
              <p class="mt-2 leading-relaxed text-brand-900/70 dark:text-white/65">{{ f.a }}</p>
            </details>
          </div>
        </section>

        <section aria-labelledby="quellen">
          <h2 id="quellen" class="font-display text-xl font-bold text-brand-900 dark:text-white">
            {{ t("erechnung.sourcesH2") }}
          </h2>
          <ul class="mt-3 space-y-1.5 text-sm">
            <li v-for="s in sources" :key="s.href">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener"
                class="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                >{{ s.label }}</a
              >
            </li>
          </ul>
          <p class="mt-4 text-sm text-brand-900/50 dark:text-white/40">
            {{ t("erechnung.disclaimer") }}
          </p>
        </section>
      </div>
    </div>
  </article>
</template>
