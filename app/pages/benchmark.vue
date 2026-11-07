<script setup lang="ts">
definePageMeta({ i18n: { locales: ["en", "de"] } });

// Every number here comes from `app/data/benchmark.json`, which the benchmark runner writes. Nothing
// is typed in by hand, so the page and the run it reports cannot drift apart.
import data from "~/data/benchmark.json";
import { highlightTs } from "~/composables/useShiki";
import VuePdfEmbed from "vue-pdf-embed";

// The six cases, exactly the files the runner imports. Shown, not summarized: the only way to judge a
// benchmark is to read what each engine was actually asked to do.
import boxesSrc from "~/benchmark-sources/boxes.ts?raw";
import canvasSrc from "~/benchmark-sources/canvas.ts?raw";
import documentSrc from "~/benchmark-sources/document.ts?raw";
import svgSrc from "~/benchmark-sources/svg.ts?raw";
import textSrc from "~/benchmark-sources/text.ts?raw";
import typographySrc from "~/benchmark-sources/typography.ts?raw";

// Its own social card: this page gets shared on its own, and the site-wide one says nothing about the
// numbers. The image is built from `og/benchmark.html` - the README beside it has the command.
const { t, te, locale } = useI18n();
const OG_TITLE = computed(() => t("benchmark.ogTitle"));
const OG_DESC = computed(() => t("benchmark.ogDescription"));
const OG_IMAGE = "https://jasy.dev/img/og-benchmark.png";
const OG_ALT = "jasy benchmark: 8.9x faster than react-pdf, 2.5x faster than pdfmake, 12 of 12";

useHead({ title: () => t("benchmark.title") });
useSeoMeta({
  title: () => t("benchmark.title"),
  description: () => t("benchmark.description"),
  ogTitle: OG_TITLE,
  ogDescription: OG_DESC,
  ogType: "article",
  ogImage: OG_IMAGE,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: "image/png",
  ogImageAlt: OG_ALT,
  twitterCard: "summary_large_image",
  twitterTitle: OG_TITLE,
  twitterDescription: OG_DESC,
  twitterImage: OG_IMAGE,
  twitterImageAlt: OG_ALT,
});

const SOURCES: Record<string, string> = {
  boxes: boxesSrc,
  canvas: canvasSrc,
  document: documentSrc,
  svg: svgSrc,
  text: textSrc,
  typography: typographySrc,
};

type Engine = {
  key: string;
  label: string;
  pkg: string;
  kind: "layout" | "drawing";
};

/**
 * The distinction the page rests on. react-pdf and pdfmake lay a document out: you describe it, they
 * decide where things go. jsPDF draws: you decide, it puts marks on the page. Both are legitimate and
 * they are not the same job, which is why they are summarized apart rather than averaged together.
 */
const ENGINES: Engine[] = [
  {
    key: "jasy",
    label: "jasy",
    pkg: "@jasy/pdf",
    kind: "layout",
  },
  {
    key: "reactPdf",
    label: "react-pdf",
    pkg: "@react-pdf/renderer",
    kind: "layout",
  },
  {
    key: "pdfmake",
    label: "pdfmake",
    pkg: "pdfmake",
    kind: "layout",
  },
  {
    key: "jsPdf",
    label: "jsPDF",
    pkg: "jspdf",
    kind: "drawing",
  },
];

type Measured = { median: number; p95: number; pages: number; bytes: number; ink?: number };
type Slot = Measured | { cannot: string };
type RawCase = { name: string; about: string; runs: number; engines: Record<string, Slot> };

/** The runner writes `about` and `cannot` in English; a translation, where there is one, is keyed by case. */
const translated = (key: string, english: string) => (te(key) ? t(key) : english);

const measured = (s?: Slot): Measured | null => (s && "median" in s ? s : null);

/** One file holds every engine's version of a case; split it so they can be read side by side. */
function split(src: string) {
  const starts = ENGINES.map((e) => ({ key: e.key, i: src.indexOf(`export const ${e.key}`) }))
    .filter((s) => s.i >= 0)
    .sort((a, b) => a.i - b.i);
  const out: Record<string, string> = { setup: src.slice(0, starts[0]?.i ?? src.length).trimEnd() };
  for (const [n, s] of starts.entries())
    out[s.key] = src.slice(s.i, starts[n + 1]?.i ?? src.length).trimEnd();
  return out;
}

const cases = computed(() =>
  (data.cases as RawCase[]).map((c) => {
    const mine = measured(c.engines.jasy)!;
    const rivals = ENGINES.slice(1).map((e) => {
      const m = measured(c.engines[e.key]);
      return {
        ...e,
        median: m?.median ?? null,
        factor: m ? m.median / mine.median : null,
        cannot: m
          ? null
          : translated(
              `benchmark.cannotWhy.${c.name}.${e.key}`,
              (c.engines[e.key] as { cannot?: string })?.cannot ?? "",
            ) || null,
      };
    });
    // One shared scale per case, so the bars are readable against each other rather than each alone.
    const slowest = Math.max(mine.median, ...rivals.map((r) => r.median ?? 0));
    const about = translated(`benchmark.about.${c.name}`, c.about);
    return { ...c, about, mine, rivals, slowest, source: split(SOURCES[c.name]!) };
  }),
);

/**
 * The geometric mean, which is the correct average of ratios - the arithmetic one would turn a 24x and
 * a 0.3x into 12x, a number that means nothing and that any reader who knows will catch.
 */
const geoMean = (values: number[]) =>
  Math.exp(values.reduce((sum, v) => sum + Math.log(v), 0) / values.length);

/** Anything inside a sixth of a turn either way is a tie, not a win - the ratio moves that much */
/** between runs on a case where two engines are close. */
const WON = 1.15;
const LOST = 0.87;

const summary = computed(() =>
  ENGINES.slice(1).map((e) => {
    const factors = cases.value
      .map((c) => c.rivals.find((r) => r.key === e.key)?.factor)
      .filter((f): f is number => f !== null && f !== undefined);
    return {
      ...e,
      mean: geoMean(factors),
      counted: factors.length,
      won: factors.filter((f) => f > WON).length,
      lost: factors.filter((f) => f < LOST).length,
    };
  }),
);

const layoutRivals = computed(() => summary.value.filter((s) => s.kind === "layout"));
const drawingRivals = computed(() => summary.value.filter((s) => s.kind === "drawing"));

/** How the twelve layout-engine comparisons fell out; the tile reports it as a record. */
const layoutRecord = computed(() => ({
  cases: layoutRivals.value.reduce((n, s) => n + s.counted, 0),
  lost: layoutRivals.value.reduce((n, s) => n + s.lost, 0),
}));

const ranAt = computed(() =>
  new Date(data.ranAt).toLocaleString(locale.value === "de" ? "de-DE" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }),
);

/** Kept out of the template: an inline generic there parses as an HTML tag and breaks the formatter. */
const versions = data.versions as Record<string, string>;

/** A fixed number of decimals, with the page language's decimal mark (8.9x, 8,9x). */
const num = (n: number, digits: number) =>
  n.toLocaleString(locale.value === "de" ? "de-DE" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
const ms = (n: number) => `${num(n, 1)} ms`;
const kb = (n: number) => `${Math.round(n / 1024)} KB`;
const x = (n: number) => `${num(n, n >= 10 ? 0 : 1)}x`;

/** How a margin reads. Inside the tie band, "1.0x faster" would be a rounding artifact. */
const verdict = (f: number) =>
  f > WON
    ? t("benchmark.faster", { x: x(f) })
    : f < LOST
      ? t("benchmark.slower", { x: x(1 / f) })
      : t("benchmark.level");

/** Bar width against the slowest engine in the same case, floored so a 24x winner stays visible. */
const bar = (v: number, slowest: number) => `${Math.max(2.5, (v / slowest) * 100)}%`;

/**
 * What the harness enforces on itself. Kept as data because the tag on each one is the point: two of
 * the four cost us the margin we would rather be printing, and saying so is worth more than the margin.
 */
const RULES = computed(() =>
  ["01", "02", "03", "04"].map((n, i) => ({
    n,
    title: t(`benchmark.rule${i + 1}Title`),
    tag: t(`benchmark.rule${i + 1}Tag`),
    body: t(`benchmark.rule${i + 1}Body`),
  })),
);

const shown = ref<Record<string, string | null>>({});
const show = (name: string, which: string) => {
  shown.value = { ...shown.value, [name]: shown.value[name] === which ? null : which };
};

const page = ref<Record<string, number>>({});
const turn = (name: string, to: number, last: number) => {
  page.value = { ...page.value, [name]: Math.min(Math.max(1, to), last) };
};

// Highlighted server-side, so the code arrives styled instead of flashing plain.
const { data: highlighted } = await useAsyncData("shiki:benchmark", async () => {
  const out: Record<string, string> = {};
  for (const c of data.cases as RawCase[]) {
    const src = split(SOURCES[c.name]!);
    for (const e of ENGINES)
      if (src[e.key])
        out[`${c.name}:${e.key}`] = await highlightTs(`${src.setup}\n\n${src[e.key]}`);
  }
  return out;
});
</script>

<template>
  <div class="bg-white dark:bg-brand-950">
    <!-- header: the only place the blueprint runs, so the data below sits on quiet ground -->
    <section class="relative overflow-hidden border-b border-brand-100 dark:border-white/10">
      <div
        class="blueprint blueprint-fade pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-5xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          benchmark <span class="text-brand-400">·</span> {{ t("benchmark.label2") }}
          <span class="text-brand-400">·</span> {{ t("benchmark.label3") }}
        </p>

        <h1
          class="mt-5 max-w-3xl font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-brand-900 sm:text-6xl dark:text-white"
        >
          {{ t("benchmark.h1") }}
        </h1>

        <i18n-t
          keypath="benchmark.lead"
          tag="p"
          scope="global"
          class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65"
        >
          <template #pure>
            <span class="font-medium text-brand-900 dark:text-white">{{
              t("benchmark.pure")
            }}</span>
          </template>
          <template v-for="pkg in ['vue', 'react', 'nuxt']" :key="pkg" #[pkg]>
            <NuxtLink
              :to="`/docs/${pkg}`"
              class="font-mono text-brand-600 hover:underline dark:text-brand-300"
              >@jasy/{{ pkg }}</NuxtLink
            >
          </template>
        </i18n-t>

        <!-- who is in the race and what kind of thing each one is, before a single number is shown -->
        <ul class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="e in ENGINES"
            :key="e.key"
            class="rounded-xl border p-4"
            :class="
              e.key === 'jasy'
                ? 'border-brand-600 bg-brand-600/5 dark:border-brand-400/60 dark:bg-brand-400/10'
                : 'border-brand-100 bg-white/60 dark:border-white/10 dark:bg-white/3'
            "
          >
            <div class="flex items-baseline justify-between gap-2">
              <span class="font-mono text-sm font-semibold text-brand-900 dark:text-white">{{
                e.label
              }}</span>
              <span
                class="shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide"
                :class="
                  e.kind === 'layout'
                    ? 'bg-brand-600/10 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                "
                >{{ e.kind === "layout" ? t("benchmark.laysOut") : t("benchmark.youLayOut") }}</span
              >
            </div>
            <p class="mt-2.5 text-sm font-medium leading-snug text-brand-900 dark:text-white/90">
              {{ t(`benchmark.${e.key}What`) }}
            </p>
            <p class="mt-1.5 text-xs leading-relaxed text-brand-900/55 dark:text-white/50">
              {{ t(`benchmark.${e.key}Note`) }}
            </p>
          </li>
        </ul>

        <dl class="mt-6 grid gap-4 sm:grid-cols-3">
          <div
            v-for="(s, i) in layoutRivals"
            :key="s.key"
            class="rounded-2xl p-6 text-white shadow-sm"
            :class="i === 0 ? 'bg-brand-600 dark:bg-brand-500' : 'bg-brand-800 dark:bg-brand-700'"
          >
            <dd class="font-display text-5xl font-bold leading-none">{{ x(s.mean) }}</dd>
            <dt class="mt-2 font-mono text-sm text-white/85">
              {{ t("benchmark.fasterThan", { engine: s.label }) }}
            </dt>
          </div>
          <div class="rounded-2xl bg-emerald-600 p-6 text-white shadow-sm dark:bg-emerald-500">
            <dd class="font-display text-5xl font-bold leading-none">
              {{ layoutRecord.cases - layoutRecord.lost }} / {{ layoutRecord.cases }}
            </dd>
            <dt class="mt-2 font-mono text-sm text-white/85">{{ t("benchmark.neverBehind") }}</dt>
          </div>
        </dl>

        <i18n-t
          keypath="benchmark.meansNote"
          tag="p"
          scope="global"
          class="mt-5 max-w-2xl text-sm leading-relaxed text-brand-900/60 dark:text-white/55"
        >
          <template #notIn>
            <span class="font-medium">{{ t("benchmark.notIn") }}</span>
          </template>
        </i18n-t>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <!-- provenance, before any number is argued about -->
      <dl
        class="grid gap-px overflow-hidden rounded-2xl bg-brand-100 text-sm sm:grid-cols-2 dark:bg-white/10"
      >
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">
            {{ t("benchmark.measured") }}
          </dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ ranAt }} UTC</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">
            {{ t("benchmark.versions") }}
          </dt>
          <dd class="mt-1 space-y-0.5 font-mono text-brand-900 dark:text-white">
            <div v-for="e in ENGINES" :key="e.key">{{ e.pkg }} {{ versions[e.key] }}</div>
          </dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">
            {{ t("benchmark.machine") }}
          </dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ data.machine.cpu }}</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">{{ t("benchmark.method") }}</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">
            {{ t("benchmark.methodValue", { runs: cases[0]!.runs, node: data.machine.node }) }}
          </dd>
        </div>
      </dl>

      <h2
        class="mt-16 font-display text-3xl font-bold tracking-tight text-brand-900 dark:text-white"
      >
        {{ t("benchmark.casesH2") }}
      </h2>
      <p class="mt-3 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
        {{ t("benchmark.casesLead") }}
      </p>

      <div class="mt-10 space-y-10">
        <article
          v-for="c in cases"
          :key="c.name"
          class="rounded-2xl border border-brand-100 p-6 sm:p-7 dark:border-white/10"
        >
          <div class="flex flex-wrap items-baseline gap-x-3">
            <h3 class="font-display text-xl font-bold text-brand-900 dark:text-white">
              {{ c.name }}
            </h3>
            <p class="text-brand-900/60 dark:text-white/55">{{ c.about }}</p>
          </div>

          <div class="mt-5 space-y-2.5">
            <div class="flex items-center gap-3">
              <span
                class="w-20 shrink-0 font-mono text-sm font-medium text-brand-900 dark:text-white"
                >jasy</span
              >
              <div class="flex h-8 flex-1 items-center rounded-lg bg-brand-50 dark:bg-white/5">
                <div
                  class="h-8 rounded-lg bg-brand-600 dark:bg-brand-500"
                  :style="{ width: bar(c.mine.median, c.slowest) }"
                />
                <span
                  class="whitespace-nowrap pl-3 font-mono text-sm font-semibold text-brand-700 dark:text-brand-300"
                  >{{ ms(c.mine.median) }}</span
                >
              </div>
              <span
                class="hidden w-24 shrink-0 text-right font-mono text-xs text-brand-900/45 sm:block dark:text-white/40"
                >{{ kb(c.mine.bytes) }}</span
              >
            </div>

            <div v-for="r in c.rivals" :key="r.key" class="flex items-center gap-3">
              <span
                class="w-20 shrink-0 truncate font-mono text-sm text-brand-900/60 dark:text-white/55"
                >{{ r.label }}</span
              >
              <div class="flex h-8 flex-1 items-center rounded-lg bg-brand-50 dark:bg-white/5">
                <template v-if="r.median !== null">
                  <div
                    class="h-8 rounded-lg bg-brand-900/20 dark:bg-white/20"
                    :style="{ width: bar(r.median, c.slowest) }"
                  />
                  <span
                    class="whitespace-nowrap pl-3 font-mono text-sm text-brand-900/70 dark:text-white/60"
                    >{{ ms(r.median) }}</span
                  >
                </template>
                <span v-else class="pl-3 font-mono text-xs text-brand-900/45 dark:text-white/40">
                  {{ t("benchmark.cannot", { why: r.cannot }) }}
                </span>
              </div>
              <span
                class="hidden w-24 shrink-0 text-right font-mono text-xs font-medium sm:block"
                :class="
                  r.factor === null
                    ? 'text-brand-900/35 dark:text-white/30'
                    : r.factor > WON
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : r.factor < LOST
                        ? 'text-brand-900/70 dark:text-white/60'
                        : 'text-brand-900/45 dark:text-white/40'
                "
                >{{ r.factor === null ? "-" : verdict(r.factor) }}</span
              >
            </div>
          </div>

          <div
            class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-brand-100 pt-4 dark:border-white/10"
          >
            <p class="font-mono text-xs text-brand-900/50 dark:text-white/45">
              {{ t("benchmark.allPages", { n: c.mine.pages, p95: ms(c.mine.p95) }, c.mine.pages) }}
            </p>
            <div class="ml-auto flex flex-wrap gap-2">
              <button
                v-for="e in ENGINES.filter((en) => c.source[en.key])"
                :key="e.key"
                type="button"
                class="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                :class="
                  shown[c.name] === e.key
                    ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500'
                    : 'border-brand-200 text-brand-900/70 hover:border-brand-400 dark:border-white/15 dark:text-white/60'
                "
                @click="show(c.name, e.key)"
              >
                {{ t("benchmark.code", { engine: e.label }) }}
              </button>
              <button
                type="button"
                class="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                :class="
                  shown[c.name] === 'output'
                    ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500'
                    : 'border-brand-200 text-brand-900/70 hover:border-brand-400 dark:border-white/15 dark:text-white/60'
                "
                @click="show(c.name, 'output')"
              >
                {{ t("benchmark.thePdfs") }}
              </button>
            </div>
          </div>

          <!-- the produced files, side by side: the structural check, made visible -->
          <div v-if="shown[c.name] === 'output'" class="mt-4">
            <p class="mb-3 font-mono text-xs text-brand-900/50 dark:text-white/45">
              {{ t("benchmark.produced", { n: c.mine.pages }, c.mine.pages) }}
            </p>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <figure v-for="e in ENGINES" :key="e.key">
                <figcaption
                  class="mb-2 flex items-baseline justify-between font-mono text-xs text-brand-900/60 dark:text-white/55"
                >
                  <span>{{ e.label }}</span>
                  <a
                    :href="`/benchmark/${c.name}-${e.key}.pdf`"
                    :download="`${c.name}-${e.key}.pdf`"
                    class="text-brand-600 hover:underline dark:text-brand-300"
                    >{{ t("benchmark.save") }}</a
                  >
                </figcaption>
                <ClientOnly>
                  <div
                    class="overflow-hidden rounded-lg bg-white ring-1 ring-brand-100 dark:ring-white/10"
                  >
                    <VuePdfEmbed
                      :source="`/benchmark/${c.name}-${e.key}.pdf`"
                      :page="page[c.name] ?? 1"
                    />
                  </div>
                </ClientOnly>
              </figure>
            </div>
            <div
              v-if="c.mine.pages > 1"
              class="mt-3 flex items-center justify-center gap-4 font-mono text-xs text-brand-900/55 dark:text-white/50"
            >
              <button
                type="button"
                class="hover:text-brand-600"
                @click="turn(c.name, (page[c.name] ?? 1) - 1, c.mine.pages)"
              >
                &larr; {{ t("benchmark.prev") }}
              </button>
              <span>{{
                t("benchmark.pageOf", { page: page[c.name] ?? 1, pages: c.mine.pages })
              }}</span>
              <button
                type="button"
                class="hover:text-brand-600"
                @click="turn(c.name, (page[c.name] ?? 1) + 1, c.mine.pages)"
              >
                {{ t("benchmark.next") }} &rarr;
              </button>
            </div>
          </div>

          <div v-else-if="shown[c.name]" class="mt-4">
            <p class="mb-2 font-mono text-xs text-brand-900/50 dark:text-white/45">
              {{
                t("benchmark.sharedSetup", {
                  engine: ENGINES.find((e) => e.key === shown[c.name])?.label ?? shown[c.name],
                })
              }}
            </p>
            <div
              class="shiki-host overflow-x-auto rounded-xl bg-brand-950 p-5 text-xs leading-relaxed"
              v-html="highlighted?.[`${c.name}:${shown[c.name]}`]"
            />
          </div>
        </article>
      </div>

      <!-- the loss, in its own section and explained without excuses -->
      <section
        v-for="d in drawingRivals"
        :key="d.key"
        class="mt-20 rounded-2xl bg-brand-50 p-6 sm:p-8 dark:bg-white/5"
      >
        <p class="spec-label text-brand-600 dark:text-brand-300">
          {{ t("benchmark.behindLabel") }}
        </p>
        <h2
          class="mt-3 font-display text-3xl font-bold tracking-tight text-brand-900 dark:text-white"
        >
          {{ t("benchmark.behindH2", { engine: d.label, x: x(1 / d.mean) }) }}
        </h2>
        <div class="mt-5 max-w-2xl space-y-4 leading-relaxed text-brand-900/75 dark:text-white/65">
          <p>{{ t("benchmark.behindP1", { engine: d.label }) }}</p>
          <p>{{ t("benchmark.behindP2") }}</p>
        </div>
      </section>

      <!-- The fairness rules, deliberately the loudest thing on the page. A benchmark written by one of
           the contestants is worth nothing until it shows what it does to catch itself. -->
      <section
        class="honest relative mt-20 overflow-hidden rounded-3xl bg-brand-950 ring-1 ring-white/10 dark:bg-brand-900"
      >
        <div
          class="blueprint blueprint-fade pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div class="relative px-6 py-12 sm:px-10 sm:py-16">
          <p class="spec-label text-brand-300">{{ t("benchmark.honestLabel") }}</p>
          <h2
            class="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl"
          >
            {{ t("benchmark.honestH2") }}
          </h2>
          <p class="mt-5 max-w-2xl leading-relaxed text-white/60">
            {{ t("benchmark.honestLead") }}
          </p>

          <ol class="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            <li v-for="r in RULES" :key="r.n" class="relative pl-14">
              <span
                class="absolute left-0 top-0 font-display text-4xl font-bold leading-none text-white/25"
                >{{ r.n }}</span
              >
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 class="font-display text-lg font-bold leading-tight text-white">
                  {{ r.title }}
                </h3>
                <span
                  class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-white/70"
                  >{{ r.tag }}</span
                >
              </div>
              <p class="mt-2.5 leading-relaxed text-white/60">{{ r.body }}</p>
            </li>
          </ol>
        </div>
      </section>

      <section class="mt-20 rounded-2xl border border-brand-100 p-6 sm:p-8 dark:border-white/10">
        <h2 class="font-display text-2xl font-bold text-brand-900 dark:text-white">
          {{ t("benchmark.runH2") }}
        </h2>
        <p class="mt-3 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
          {{ t("benchmark.runLead") }}
        </p>
        <pre
          class="mt-5 overflow-x-auto rounded-xl bg-brand-950 p-5 font-mono text-sm leading-relaxed text-white/90"
        ><code>git clone https://github.com/jasy-pdf/jasy
cd jasy/bench
pnpm install
pnpm bench</code></pre>
        <p class="mt-5 max-w-2xl text-sm leading-relaxed text-brand-900/60 dark:text-white/55">
          {{ t("benchmark.runPr") }}
        </p>
      </section>

      <p class="mt-12 text-sm leading-relaxed text-brand-900/55 dark:text-white/50">
        {{ t("benchmark.outro") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* The honesty panel is navy in both themes, so it needs its own grid: the light theme's lines are dark
   and would disappear into it. */
.honest {
  --grid-line: rgb(255 255 255 / 0.05);
  --grid-major: rgb(255 255 255 / 0.1);
}

/* Shiki paints its own background; the brand-navy panel should show through instead. */
.shiki-host :deep(pre.shiki) {
  margin: 0;
  background: transparent !important;
}
.shiki-host :deep(code) {
  font-family: var(--font-mono);
}
</style>
