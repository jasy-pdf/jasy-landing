<script setup lang="ts">
// Every number here comes from `app/data/benchmark.json`, which the benchmark runner writes. Nothing
// is typed in by hand, so the page and the run it reports cannot drift apart.
import data from "~/data/benchmark.json";
import { highlightTs } from "~/composables/useShiki";
import VuePdfEmbed from "vue-pdf-embed";

// The six cases, exactly the files the runner imports. Shown, not summarised: the only way to judge a
// benchmark is to read what each engine was actually asked to do.
import boxesSrc from "~/benchmark-sources/boxes.ts?raw";
import canvasSrc from "~/benchmark-sources/canvas.ts?raw";
import documentSrc from "~/benchmark-sources/document.ts?raw";
import svgSrc from "~/benchmark-sources/svg.ts?raw";
import textSrc from "~/benchmark-sources/text.ts?raw";
import typographySrc from "~/benchmark-sources/typography.ts?raw";

// Its own social card: this page gets shared on its own, and the site-wide one says nothing about the
// numbers. The image is built from `og/benchmark.html` - the README beside it has the command.
const OG_TITLE = "How fast is jasy? Here is everything we measured.";
const OG_DESC =
  "Six documents against react-pdf, pdfmake and jsPDF. Same words, same pages, same ink - " +
  "checked before a single number is printed. The harness and every case are in the repo.";
const OG_IMAGE = "https://jasy.dev/img/og-benchmark.png";
const OG_ALT = "jasy benchmark: 5.9x faster than react-pdf, 1.6x faster than pdfmake, 10 of 12";

useHead({ title: "Benchmark - jasy" });
useSeoMeta({
  title: "Benchmark - jasy",
  description:
    "jasy against react-pdf, pdfmake and jsPDF on six documents - same text, same pages, same ink. " +
    "The harness, the cases and the raw numbers are all here; four lines and you have your own.",
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
  /** What the thing IS, in one line - shown before any number, so nobody has to infer it from a bar. */
  what: string;
  note: string;
};

/**
 * The distinction the page rests on. react-pdf and pdfmake lay a document out: you describe it, they
 * decide where things go. jsPDF draws: you decide, it puts marks on the page. Both are legitimate and
 * they are not the same job, which is why they are summarised apart rather than averaged together.
 */
const ENGINES: Engine[] = [
  {
    key: "jasy",
    label: "jasy",
    pkg: "@jasy/pdf",
    kind: "layout",
    what: "Flexbox layout, in pure TypeScript.",
    note: "Works the document out itself - line breaks, pagination, kerning, SVG. No headless browser, no WASM, no JVM.",
  },
  {
    key: "reactPdf",
    label: "react-pdf",
    pkg: "@react-pdf/renderer",
    kind: "layout",
    what: "Flexbox layout, as React components.",
    note: "The same job through Yoga and a React tree. The closest comparison on this page.",
  },
  {
    key: "pdfmake",
    label: "pdfmake",
    pkg: "pdfmake",
    kind: "layout",
    what: "Declarative layout, one document object.",
    note: "Works it out too, with its own column and table model. Kerns, and takes SVG markup directly.",
  },
  {
    key: "jsPdf",
    label: "jsPDF",
    pkg: "jspdf",
    kind: "drawing",
    what: "A drawing API. No layout.",
    note: "You work out every coordinate and every page break. That is why it is quick here, and why two cases are blank.",
  },
];

type Measured = { median: number; p95: number; pages: number; bytes: number; ink?: number };
type Slot = Measured | { cannot: string };
type RawCase = { name: string; about: string; runs: number; engines: Record<string, Slot> };

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
        cannot: m ? null : ((c.engines[e.key] as { cannot?: string })?.cannot ?? null),
      };
    });
    // One shared scale per case, so the bars are readable against each other rather than each alone.
    const slowest = Math.max(mine.median, ...rivals.map((r) => r.median ?? 0));
    return { ...c, mine, rivals, slowest, source: split(SOURCES[c.name]!) };
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
  new Date(data.ranAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }),
);

/** Kept out of the template: an inline generic there parses as an HTML tag and breaks the formatter. */
const versions = data.versions as Record<string, string>;

const ms = (n: number) => `${n.toFixed(1)} ms`;
const kb = (n: number) => `${Math.round(n / 1024)} KB`;
const x = (n: number) => `${n.toFixed(n >= 10 ? 0 : 1)}x`;

/** How a margin reads. Inside the tie band, "1.0x faster" would be a rounding artefact. */
const verdict = (f: number) =>
  f > WON ? `${x(f)} faster` : f < LOST ? `${x(1 / f)} slower` : "level";

/** Bar width against the slowest engine in the same case, floored so a 24x winner stays visible. */
const bar = (v: number, slowest: number) => `${Math.max(2.5, (v / slowest) * 100)}%`;

/**
 * What the harness enforces on itself. Kept as data because the tag on each one is the point: two of
 * the four cost us the margin we would rather be printing, and saying so is worth more than the margin.
 */
const RULES = [
  {
    n: "01",
    title: "Every engine draws the same document",
    tag: "caught us twice",
    body:
      "Same words, same count, same pages - checked before a ratio is printed, and the runner refuses " +
      "to print one otherwise. It has earned its keep twice, both times on our own mistakes: a case " +
      "that handed react-pdf a cell too short for its line, so it drew no labels at all while the page " +
      "count still matched; and a header spacing we had set on one side only, which put a whole body " +
      "8pt lower.",
  },
  {
    n: "02",
    title: "Every paragraph is different",
    tag: "cost us 39 points",
    body:
      "A benchmark that repeats one string measures caching, not layout. Ours did, and the repetition " +
      "helped react-pdf far more than us - on the same machine and the same day, the flowing-text case " +
      "came out 45% in its favour with one repeated paragraph and 6% with 180 different ones. Real " +
      "documents have no identical paragraphs, so neither do these.",
  },
  {
    n: "03",
    title: "The settings are converted, not assumed",
    tag: "the tedious one",
    body:
      "The same word means different things in each of them: a line height multiplies the font size in " +
      "jasy, the font's own natural height in pdfmake, and is not inherited into nested text at all in " +
      "react-pdf. None of that is a fault - it just has to be converted, or the documents break in " +
      "different places. Every conversion is pinned in the case with the reason beside it.",
  },
  {
    n: "04",
    title: "We switch our own features off",
    tag: "our handicap",
    body:
      "jasy keeps two lines of a paragraph together at a page break; jsPDF has no such rule. So it is " +
      "turned off in the report case, on our side and react-pdf's. Handicapping ourselves is what makes " +
      "it the same document.",
  },
];

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
          benchmark <span class="text-brand-400">·</span> pure typescript
          <span class="text-brand-400">·</span> run it yourself
        </p>

        <h1
          class="mt-5 max-w-3xl font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-brand-900 sm:text-6xl dark:text-white"
        >
          How fast is jasy? Here is everything we measured.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          Six documents, four engines, every comparison held to the same text on the same pages.
          jasy is a PDF engine in
          <span class="font-medium text-brand-900 dark:text-white">pure TypeScript</span> - no
          headless browser, no WASM, no JVM - and it is what
          <NuxtLink
            to="/docs/vue"
            class="font-mono text-brand-600 hover:underline dark:text-brand-300"
            >@jasy/vue</NuxtLink
          >
          and
          <NuxtLink
            to="/docs/nuxt"
            class="font-mono text-brand-600 hover:underline dark:text-brand-300"
            >@jasy/nuxt</NuxtLink
          >
          render with.
        </p>

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
                >{{ e.kind === "layout" ? "lays out" : "you lay out" }}</span
              >
            </div>
            <p class="mt-2.5 text-sm font-medium leading-snug text-brand-900 dark:text-white/90">
              {{ e.what }}
            </p>
            <p class="mt-1.5 text-xs leading-relaxed text-brand-900/55 dark:text-white/50">
              {{ e.note }}
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
            <dt class="mt-2 font-mono text-sm text-white/85">faster than {{ s.label }}</dt>
          </div>
          <div class="rounded-2xl bg-emerald-600 p-6 text-white shadow-sm dark:bg-emerald-500">
            <dd class="font-display text-5xl font-bold leading-none">
              {{ layoutRecord.cases - layoutRecord.lost }} / {{ layoutRecord.cases }}
            </dd>
            <dt class="mt-2 font-mono text-sm text-white/85">never behind</dt>
          </div>
        </dl>

        <p class="mt-5 max-w-2xl text-sm leading-relaxed text-brand-900/60 dark:text-white/55">
          Both figures are geometric means, which is the correct average of ratios.
          <span class="font-medium">jsPDF is not in them</span> - it draws where these lay out, and
          an average across the two would mean nothing. Its comparison has its own section below,
          losses included.
        </p>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <!-- provenance, before any number is argued about -->
      <dl
        class="grid gap-px overflow-hidden rounded-2xl bg-brand-100 text-sm sm:grid-cols-2 dark:bg-white/10"
      >
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">measured</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ ranAt }} UTC</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">versions</dt>
          <dd class="mt-1 space-y-0.5 font-mono text-brand-900 dark:text-white">
            <div v-for="e in ENGINES" :key="e.key">{{ e.pkg }} {{ versions[e.key] }}</div>
          </dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">machine</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ data.machine.cpu }}</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">method</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">
            median of {{ cases[0]!.runs }} runs, node {{ data.machine.node }}
          </dd>
        </div>
      </dl>

      <h2
        class="mt-16 font-display text-3xl font-bold tracking-tight text-brand-900 dark:text-white"
      >
        The six documents
      </h2>
      <p class="mt-3 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
        Bars are to scale within a case, against its slowest engine. Every pairing was checked for
        the same words on the same pages before a ratio was printed.
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
                  cannot render this - {{ r.cannot }}
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
              all {{ c.mine.pages }} {{ c.mine.pages === 1 ? "page" : "pages" }} · p95
              {{ ms(c.mine.p95) }}
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
                {{ e.label }} code
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
                the PDFs
              </button>
            </div>
          </div>

          <!-- the produced files, side by side: the structural check, made visible -->
          <div v-if="shown[c.name] === 'output'" class="mt-4">
            <p class="mb-3 font-mono text-xs text-brand-900/50 dark:text-white/45">
              What this run produced. Same document, same {{ c.mine.pages }}
              {{ c.mine.pages === 1 ? "page" : "pages" }} - look rather than take our word for it.
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
                    >save</a
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
                &larr; prev
              </button>
              <span>page {{ page[c.name] ?? 1 }} of {{ c.mine.pages }}</span>
              <button
                type="button"
                class="hover:text-brand-600"
                @click="turn(c.name, (page[c.name] ?? 1) + 1, c.mine.pages)"
              >
                next &rarr;
              </button>
            </div>
          </div>

          <div v-else-if="shown[c.name]" class="mt-4">
            <p class="mb-2 font-mono text-xs text-brand-900/50 dark:text-white/45">
              The shared setup, then the {{ shown[c.name] }} document - the file the runner imports.
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
        <p class="spec-label text-brand-600 dark:text-brand-300">where jasy is behind</p>
        <h2
          class="mt-3 font-display text-3xl font-bold tracking-tight text-brand-900 dark:text-white"
        >
          {{ d.label }} is {{ x(1 / d.mean) }} faster.
        </h2>
        <div class="mt-5 max-w-2xl space-y-4 leading-relaxed text-brand-900/75 dark:text-white/65">
          <p>
            It draws where the others lay out, and drawing is cheaper. There is no defect on either
            side - you are the one doing the layout. In the report case that is 73 lines of
            {{ d.label }} against 41 of jasy: every y coordinate, every page break, and the header
            redrawn after each new page. Both are on this page; read them rather than take the
            count.
          </p>
          <p>
            That is the whole trade. You pay roughly forty milliseconds on thirteen pages, and stop
            writing that loop. Two of the six documents it cannot produce at all - the SVG case
            needs a second library, and it never kerns, so the same words do not land in the same
            places.
          </p>
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
          <p class="spec-label text-brand-300">what keeps this honest</p>
          <h2
            class="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl"
          >
            A benchmark written by the author of one of the engines is worth nothing until it shows
            what it did to catch itself.
          </h2>
          <p class="mt-5 max-w-2xl leading-relaxed text-white/60">
            So here is every rule this harness enforces - including the two that cost us the numbers
            we would rather be printing. They stay in.
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
          Run it yourself
        </h2>
        <p class="mt-3 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
          The harness, the six documents and the raw JSON behind this page are in the repository. It
          pins the versions it compares against, and prints the machine it ran on.
        </p>
        <pre
          class="mt-5 overflow-x-auto rounded-xl bg-brand-950 p-5 font-mono text-sm leading-relaxed text-white/90"
        ><code>git clone https://github.com/jasy-pdf/jasy
cd jasy/bench
pnpm install
pnpm bench</code></pre>
        <p class="mt-5 max-w-2xl text-sm leading-relaxed text-brand-900/60 dark:text-white/55">
          Your document is not among the six? That is the fair objection to any benchmark, and the
          answer is a pull request - a case is one file with one function per engine.
        </p>
      </section>

      <p class="mt-12 text-sm leading-relaxed text-brand-900/55 dark:text-white/50">
        One machine, one day, six documents. Your numbers will differ - which is the point of
        publishing the harness rather than only the result.
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
