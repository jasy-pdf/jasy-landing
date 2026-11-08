<script setup lang="ts">
// What jasy does differently from react-pdf: only what was measured against the version named here, each with the code that
// shows it. A claim that stops holding after a re-measurement leaves the page (see `compare.dropped`).
import bench from "~/data/benchmark.json";

definePageMeta({ i18n: { locales: ["en", "de"] } });

const { t, tm, rt, locale } = useI18n();
const localizedTo = useLocalizedTo();

const REACT_PDF = "4.9.0";
const MEASURED = "2026-11-08";

const date = computed(() =>
  new Date(MEASURED).toLocaleDateString(locale.value === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

// The average speed-up comes from the benchmark's own data, as on /benchmark.
type Slot = { median?: number };
const factors = (bench.cases as { engines: Record<string, Slot> }[])
  .map((c) => (c.engines.reactPdf?.median ?? 0) / (c.engines.jasy?.median ?? 1))
  .filter((f) => f > 0);
const speedup = Math.exp(factors.reduce((s, f) => s + Math.log(f), 0) / factors.length);
const speed = computed(
  () =>
    new Intl.NumberFormat(locale.value === "de" ? "de-DE" : "en-US", {
      maximumFractionDigits: 1,
    }).format(speedup) + "×",
);

type Point = { id: string; code: string };
const points: Point[] = [
  {
    id: "enc",
    code: `// react-pdf ${REACT_PDF}
<Document userPassword="secret">...</Document>
// %PDF-1.3 ... /Encrypt << /V 1 /R 2 >>        40-bit RC4
<Document userPassword="secret" pdfVersion="1.7ext3">...</Document>
// %PDF-1.7 ... /Encrypt << /V 5 /R 5 >> /AESV3  AES-256, revision 5

// jasy
await renderToBytes(doc, { encrypt: { userPassword: "secret" } });
// %PDF-2.0 ... /Encrypt << /V 5 /R 6 >> /AESV3  AES-256`,
  },
  {
    id: "ua",
    code: `// react-pdf ${REACT_PDF} - title and language, but no structure tree
<Document title="Quarterly report" language="en-US">...</Document>
// verapdf -f ua1: not compliant, 4 failed rules

// jasy
Text("Quarterly report", { role: "h1" });
await renderToBytes(doc, { accessible: true, title: "Quarterly report", lang: "en-US" });
// verapdf -f ua1: compliant, 0 failed rules`,
  },
  {
    id: "svg",
    code: `<!-- styled.svg, as Illustrator's "Internal CSS" export writes it -->
<svg viewBox="0 0 120 60"><defs><style>.cls-1{fill:#e2483d}.cls-2{fill:#1450aa}</style></defs>
  <rect class="cls-1" width="55" height="60"/><circle class="cls-2" cx="90" cy="30" r="28"/></svg>

// react-pdf ${REACT_PDF}
<Image src="styled.svg" style={{ width: 120 }} />

// jasy
Image("styled.svg", { width: 120 });`,
  },
  {
    id: "hy",
    code: `// react-pdf ${REACT_PDF}: a narrow column, nothing configured
<View style={{ width: 100 }}><Text>Umsatzsteueridentifikationsnummer</Text></View>

// jasy, with German patterns
import { hyphenateSync } from "hyphen/de";
const hyphenate = (word: string) => hyphenateSync(word).split("\\u00AD");
Box({ width: 100 }, [Text("Umsatzsteueridentifikationsnummer", { hyphenate })]);`,
  },
  {
    id: "of",
    code: `// react-pdf ${REACT_PDF}: two lines of 34pt text, 50pt of room
<Page size={[420, 90]} style={{ padding: 20 }}>
  <Text style={{ fontSize: 34 }}>Typography, jumping quickly</Text>
</Page>
// FATAL ERROR: ... JavaScript heap out of memory

// jasy: the same page
// Layout overflow: Text is 79pt tall but the page region is only 50pt and it cannot be
// broken - reduce its size, give it a bounded height, or let it split across pages.`,
  },
];

const hyphenRows = [
  { word: "Urinstinkt", width: 40, rp: "Urin- | stinkt", jasy: "Ur- | instinkt" },
  {
    word: "Umsatzsteueridentifikationsnummer",
    width: 100,
    rp: "Umsatzsteueri- | dentifikationsnum- | mer",
    jasy: "Umsatzsteuer- | identifikationsnum- | mer",
  },
];

const only = ["forms", "einvoice", "vue", "emoji", "speed"] as const;
const onlyLinks: Record<(typeof only)[number], string> = {
  forms: "/docs/pdf/forms",
  einvoice: "/docs/invoicing",
  vue: "/docs/vue",
  emoji: "/docs/pdf/emoji",
  speed: "/benchmark",
};
const level = computed(() => (tm("compare.level") as unknown[]).map((m) => rt(m as never)));

const title = computed(() => t("compare.title"));
const description = computed(() => t("compare.description"));
const pageUrl = computed(
  () => `https://jasy.dev${locale.value === "de" ? "/de" : ""}/react-pdf-alternative`,
);
useHead({
  title,
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title.value,
          description: description.value,
          inLanguage: locale.value === "de" ? "de-DE" : "en-US",
          dateModified: MEASURED,
          author: { "@type": "Person", name: "Florian Heuberger" },
          publisher: { "@type": "Organization", name: "jasy", url: "https://jasy.dev" },
          mainEntityOfPage: pageUrl.value,
          about: ["react-pdf", "PDF generation", "TypeScript"],
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
        <p class="spec-label text-brand-600 dark:text-brand-300">{{ t("compare.label") }}</p>
        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          {{ t("compare.h1Before") }}
          <span class="relative whitespace-nowrap"
            >{{ t("compare.h1Highlight")
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
          >{{ t("compare.h1After") }}
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          {{ t("compare.lead", { version: REACT_PDF, date }) }}
        </p>
      </header>

      <section class="mx-auto mt-16 max-w-4xl" aria-labelledby="measured">
        <h2
          id="measured"
          class="font-display text-2xl font-bold text-brand-900 sm:text-3xl dark:text-white"
        >
          {{ t("compare.measuredH2") }}
        </h2>

        <div class="mt-8 space-y-10">
          <section
            v-for="(p, i) in points"
            :id="p.id"
            :key="p.id"
            class="rounded-2xl border border-brand-200/70 bg-white/70 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/5"
          >
            <p class="spec-label text-brand-500 dark:text-brand-300">0{{ i + 1 }}</p>
            <h3 class="mt-2 font-display text-xl font-bold text-brand-900 dark:text-white">
              {{ t(`compare.${p.id}.title`) }}
            </h3>
            <p class="mt-3 leading-relaxed text-brand-900/75 dark:text-white/70">
              {{ t(`compare.${p.id}.lead`) }}
            </p>

            <dl class="mt-5 grid gap-3 sm:grid-cols-2">
              <div
                class="rounded-xl border border-brand-100 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <dt class="spec-label text-brand-900/60 dark:text-white/50">
                  {{ t("compare.reactPdf", { version: REACT_PDF }) }}
                </dt>
                <dd class="mt-1.5 text-sm leading-relaxed text-brand-900/80 dark:text-white/75">
                  {{ t(`compare.${p.id}.rp`) }}
                </dd>
              </div>
              <div
                class="rounded-xl bg-brand-50 p-4 ring-1 ring-inset ring-brand-200/70 dark:bg-brand-500/10 dark:ring-white/10"
              >
                <dt class="spec-label text-brand-600 dark:text-brand-300">
                  {{ t("compare.jasy") }}
                </dt>
                <dd class="mt-1.5 text-sm leading-relaxed text-brand-900/80 dark:text-white/75">
                  {{ t(`compare.${p.id}.jasy`) }}
                </dd>
              </div>
            </dl>

            <div v-if="p.id === 'svg'" class="mt-5 grid gap-3 sm:grid-cols-2">
              <figure
                v-for="e in ['react-pdf', 'jasy']"
                :key="e"
                class="relative overflow-hidden rounded-xl border border-brand-200/70 bg-white dark:border-white/10"
              >
                <p
                  v-if="e === 'react-pdf'"
                  class="absolute inset-x-0 top-0 flex aspect-2/1 items-center justify-center text-sm italic text-brand-900/45"
                >
                  {{ t("compare.svg.blank") }}
                </p>
                <img
                  :src="`/compare/svgstyle-${e}.png`"
                  :alt="t('compare.svg.alt', { engine: e })"
                  width="556"
                  height="278"
                  loading="lazy"
                  class="block w-full"
                />
                <figcaption
                  class="border-t border-brand-100 px-3 py-2 font-mono text-xs text-brand-600"
                >
                  {{ e === "react-pdf" ? t("compare.reactPdf", { version: REACT_PDF }) : "jasy" }}
                </figcaption>
              </figure>
            </div>

            <div v-if="p.id === 'hy'" class="mt-5 overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="text-brand-600 dark:text-brand-300">
                  <tr>
                    <th class="py-2 pr-4 font-semibold">{{ t("compare.hy.word") }}</th>
                    <th class="py-2 pr-4 font-semibold">
                      {{ t("compare.hy.rp", { version: REACT_PDF }) }}
                    </th>
                    <th class="py-2 font-semibold">{{ t("compare.hy.jasy") }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-100 dark:divide-white/10">
                  <tr v-for="r in hyphenRows" :key="r.word">
                    <td class="py-2 pr-4 align-top text-brand-900 dark:text-white">
                      {{ r.word }} <span class="text-brand-500">({{ r.width }} pt)</span>
                    </td>
                    <td class="py-2 pr-4 align-top font-mono text-brand-900/60 dark:text-white/55">
                      {{ r.rp }}
                    </td>
                    <td
                      class="py-2 align-top font-mono font-semibold text-brand-700 dark:text-brand-200"
                    >
                      {{ r.jasy }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p
              v-if="p.id === 'enc' || p.id === 'hy'"
              class="mt-4 text-sm leading-relaxed text-brand-900/60 dark:text-white/50"
            >
              {{ t(`compare.${p.id}.note`) }}
            </p>

            <details class="mt-5">
              <summary
                class="cursor-pointer text-sm font-semibold text-brand-700 dark:text-brand-200"
              >
                {{ t("compare.reproduce") }}
              </summary>
              <pre
                class="mt-3 overflow-x-auto rounded-xl bg-brand-900 p-4 font-mono text-[0.78rem] leading-relaxed text-white/90 dark:bg-black/30"
              ><code>{{ p.code }}</code></pre>
            </details>
          </section>
        </div>
      </section>

      <section class="mx-auto mt-20 max-w-4xl" aria-labelledby="only">
        <h2
          id="only"
          class="font-display text-2xl font-bold text-brand-900 sm:text-3xl dark:text-white"
        >
          {{ t("compare.onlyH2") }}
        </h2>
        <ul class="mt-6 grid gap-4 sm:grid-cols-2">
          <li v-for="k in only" :key="k">
            <NuxtLink
              :to="localizedTo(onlyLinks[k])"
              class="block h-full rounded-2xl border border-brand-200/70 bg-white/70 p-5 transition-colors hover:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-300"
            >
              <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
                {{ t(`compare.only.${k}.title`, { x: speed }) }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
                {{ t(`compare.only.${k}.text`, { version: bench.versions.reactPdf }) }}
              </p>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section class="mx-auto mt-20 max-w-3xl" aria-labelledby="level">
        <h2 id="level" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
          {{ t("compare.levelH2") }}
        </h2>
        <ul
          class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-brand-900/75 dark:text-white/70"
        >
          <li v-for="l in level" :key="l">{{ l }}</li>
        </ul>
        <p class="mt-6 text-sm leading-relaxed text-brand-900/60 dark:text-white/50">
          {{ t("compare.dropped") }}
        </p>
        <p class="mt-3 text-sm leading-relaxed text-brand-900/60 dark:text-white/50">
          {{ t("compare.how") }}
        </p>
        <div class="mt-6 flex flex-wrap gap-2.5">
          <UButton
            :to="localizedTo('/docs')"
            color="primary"
            icon="i-lucide-book-open"
            :label="t('compare.docs')"
          />
          <UButton
            :to="localizedTo('/benchmark')"
            color="neutral"
            variant="outline"
            :label="t('compare.benchmark')"
          />
        </div>
      </section>
    </div>
  </article>
</template>
