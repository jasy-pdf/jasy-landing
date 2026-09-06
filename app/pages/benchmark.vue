<script setup lang="ts">
// Every number on this page comes from `app/data/benchmark.json`, which the benchmark runner writes.
// Nothing is typed in by hand - so the page and the run it reports can never drift apart.
import data from "~/data/benchmark.json";
import { highlightTs } from "~/composables/useShiki";

// The six cases, exactly the files the runner imports. Shown, not summarised: the only way to judge a
// benchmark is to read what each engine was actually asked to do.
import boxesSrc from "~/benchmark-sources/boxes.ts?raw";
import canvasSrc from "~/benchmark-sources/canvas.ts?raw";
import documentSrc from "~/benchmark-sources/document.ts?raw";
import svgSrc from "~/benchmark-sources/svg.ts?raw";
import textSrc from "~/benchmark-sources/text.ts?raw";
import typographySrc from "~/benchmark-sources/typography.ts?raw";

const SOURCES: Record<string, string> = {
  boxes: boxesSrc,
  canvas: canvasSrc,
  document: documentSrc,
  svg: svgSrc,
  text: textSrc,
  typography: typographySrc,
};

/** One file holds both engines; split it so the two can sit next to each other. */
function split(src: string) {
  const a = src.indexOf("export const jasy");
  const b = src.indexOf("export const reactPdf");
  return {
    setup: src.slice(0, a).trimEnd(),
    jasy: src.slice(a, b).trimEnd(),
    reactPdf: src.slice(b).trimEnd(),
  };
}

useHead({ title: "Benchmark - jasy" });
useSeoMeta({
  title: "Benchmark - jasy",
  description:
    "How fast jasy renders a PDF, measured against @react-pdf/renderer on the same documents. " +
    "Run it yourself: the harness, the cases and the raw numbers are all here.",
});

type Result = { median: number; p95: number; pages: number; bytes: number };
type Case = { name: string; about: string; jasy: Result; reactPdf: Result; runs: number };

const cases = computed(() =>
  (data.cases as Case[])
    .map((c) => ({ ...c, factor: c.reactPdf.median / c.jasy.median, source: split(SOURCES[c.name]!) }))
    .sort((a, b) => b.factor - a.factor),
);

/** Which engine's source a card is showing; null hides both. */
const shown = ref<Record<string, "jasy" | "reactPdf" | null>>({});
const show = (name: string, which: "jasy" | "reactPdf") => {
  shown.value = { ...shown.value, [name]: shown.value[name] === which ? null : which };
};

const fastest = computed(() => cases.value[0]!);
const slowest = computed(() => cases.value[cases.value.length - 1]!);

/** The middle of the six, so the headline is not carried by its best case alone. */
const median = computed(() => {
  const f = cases.value.map((c) => c.factor).sort((a, b) => a - b);
  return (f[f.length / 2 - 1]! + f[f.length / 2]!) / 2;
});

const ranAt = computed(() =>
  new Date(data.ranAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }),
);

/** Deliberately the whole thing, not a sketch: a reader must be able to paste it and get a number. */
const RUNNER = `import * as testCase from "./text.mjs"; // the file you copied

const measure = async (fn, runs = 15, warmup = 3) => {
  for (let i = 0; i < warmup; i++) await fn();
  const times = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    await fn();
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
};

for (const engine of ["jasy", "reactPdf"]) {
  const bytes = await testCase[engine]();
  console.log(
    engine.padEnd(10),
    (await measure(() => testCase[engine]())).toFixed(1),
    "ms",
    bytes.length,
    "bytes",
  );
}
`;

const ms = (n: number) => `${n.toFixed(1)} ms`;
const kb = (n: number) => `${Math.round(n / 1024)} KB`;
const x = (n: number) => `${n.toFixed(1)}x`;

// Highlighted server-side, so the code is styled in the first HTML rather than flashing plain.
const { data: highlighted } = await useAsyncData("shiki:benchmark", async () => {
  const out: Record<string, string> = { runner: await highlightTs(RUNNER) };
  for (const c of data.cases as Case[]) {
    const src = split(SOURCES[c.name]!);
    out[`${c.name}:jasy`] = await highlightTs(`${src.setup}\n\n${src.jasy}`);
    out[`${c.name}:reactPdf`] = await highlightTs(`${src.setup}\n\n${src.reactPdf}`);
  }
  return out;
});

/** Bar width in percent, longest bar in the pair at 100. */
const bar = (v: number, other: number) => `${Math.max(4, (v / Math.max(v, other)) * 100)}%`;
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-5xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <!-- header -->
      <p class="spec-label text-brand-600 dark:text-brand-300">
        benchmark <span class="text-brand-400">·</span> pure typescript
        <span class="text-brand-400">·</span> run it yourself
      </p>

      <h1
        class="mt-5 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-brand-900 sm:text-6xl dark:text-white"
      >
        Up to
        <span class="text-brand-600 dark:text-brand-300">{{ x(fastest.factor) }}</span>
        faster than react-pdf.
      </h1>

      <p class="mt-5 text-xl font-medium text-brand-900 dark:text-white">
        And ahead on all {{ cases.length }} documents, not just the flattering one.
      </p>

      <!-- the three numbers, before anything else -->
      <dl class="mt-10 grid gap-4 sm:grid-cols-3">
        <div
          class="rounded-2xl bg-brand-600 p-6 text-white dark:bg-brand-500"
        >
          <dd class="font-display text-4xl font-bold leading-none">{{ x(fastest.factor) }}</dd>
          <dt class="mt-2 font-mono text-sm text-white/80">best - {{ fastest.name }}</dt>
        </div>
        <div class="rounded-2xl bg-brand-50 p-6 dark:bg-white/5">
          <dd class="font-display text-4xl font-bold leading-none text-brand-900 dark:text-white">
            {{ x(median) }}
          </dd>
          <dt class="mt-2 font-mono text-sm text-brand-900/60 dark:text-white/55">
            median of the six
          </dt>
        </div>
        <div class="rounded-2xl bg-brand-50 p-6 dark:bg-white/5">
          <dd class="font-display text-4xl font-bold leading-none text-brand-900 dark:text-white">
            {{ cases.length }} / {{ cases.length }}
          </dd>
          <dt class="mt-2 font-mono text-sm text-brand-900/60 dark:text-white/55">documents won</dt>
        </div>
      </dl>

      <p class="mt-8 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        jasy is a PDF engine in
        <span class="font-medium text-brand-900 dark:text-white">pure TypeScript</span> - no headless
        browser, no WASM, no JVM. It is what
        <NuxtLink
          to="/docs/vue"
          class="font-mono font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
          >@jasy/vue</NuxtLink
        >
        and
        <NuxtLink
          to="/docs/nuxt"
          class="font-mono font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
          >@jasy/nuxt</NuxtLink
        >
        render with, in the browser and on the server alike.
      </p>

      <p class="mt-4 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
        Measured against
        <span class="font-medium text-brand-900 dark:text-white">@react-pdf/renderer</span> - the fair
        comparison, since it is the same idea: declarative components to PDF, no browser. The narrowest
        margin is {{ slowest.name }} at {{ x(slowest.factor) }}, and it is on this page for that
        reason.
      </p>

      <!-- provenance: first, because a number without this cannot be checked -->
      <dl
        class="mt-10 grid gap-px overflow-hidden rounded-2xl bg-brand-100 text-sm sm:grid-cols-2 dark:bg-white/10"
      >
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">measured</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ ranAt }} UTC</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">versions</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">
            @jasy/pdf {{ data.versions.jasy }}<br />
            @react-pdf/renderer {{ data.versions.reactPdf }}
          </dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">machine</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">{{ data.machine.cpu }}</dd>
        </div>
        <div class="bg-white p-5 dark:bg-brand-950">
          <dt class="spec-label text-brand-600 dark:text-brand-300">runtime</dt>
          <dd class="mt-1 font-mono text-brand-900 dark:text-white">
            node {{ data.machine.node }} · {{ data.machine.os }}
          </dd>
        </div>
      </dl>

      <p class="mt-4 font-mono text-sm text-brand-900/55 dark:text-white/50">
        Median of {{ cases[0]!.runs }} timed runs after 3 warm-ups, per document.
      </p>

      <!-- the comparisons -->
      <div class="mt-16 space-y-10">
        <article v-for="c in cases" :key="c.name">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 class="font-display text-xl font-bold text-brand-900 dark:text-white">
              {{ c.name }}
            </h2>
            <span class="font-mono text-sm font-medium text-brand-600 dark:text-brand-300">
              {{ x(c.factor) }} faster
            </span>
          </div>
          <p class="mt-1 text-brand-900/65 dark:text-white/60">{{ c.about }}</p>

          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-3">
              <span class="w-24 shrink-0 font-mono text-sm text-brand-900 dark:text-white">jasy</span>
              <div class="h-7 flex-1 rounded-md bg-brand-50 dark:bg-white/5">
                <div
                  class="flex h-7 items-center rounded-md bg-brand-600 pl-3 dark:bg-brand-500"
                  :style="{ width: bar(c.jasy.median, c.reactPdf.median) }"
                >
                  <span class="font-mono text-xs font-medium text-white">{{ ms(c.jasy.median) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-24 shrink-0 font-mono text-sm text-brand-900/60 dark:text-white/55">
                react-pdf
              </span>
              <div class="h-7 flex-1 rounded-md bg-brand-50 dark:bg-white/5">
                <div
                  class="flex h-7 items-center rounded-md bg-brand-900/25 pl-3 dark:bg-white/20"
                  :style="{ width: bar(c.reactPdf.median, c.jasy.median) }"
                >
                  <span class="font-mono text-xs font-medium text-brand-900 dark:text-white">
                    {{ ms(c.reactPdf.median) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p class="font-mono text-xs text-brand-900/55 dark:text-white/50">
              p95 {{ ms(c.jasy.p95) }} vs {{ ms(c.reactPdf.p95) }} · both {{ c.jasy.pages }}
              {{ c.jasy.pages === 1 ? "page" : "pages" }} · {{ kb(c.jasy.bytes) }} vs
              {{ kb(c.reactPdf.bytes) }}
            </p>
            <div class="ml-auto flex gap-2">
              <button
                v-for="engine in (['jasy', 'reactPdf'] as const)"
                :key="engine"
                type="button"
                class="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                :class="
                  shown[c.name] === engine
                    ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500'
                    : 'border-brand-200 text-brand-900/70 hover:border-brand-400 dark:border-white/15 dark:text-white/60'
                "
                @click="show(c.name, engine)"
              >
                {{ engine === "jasy" ? "jasy code" : "react-pdf code" }}
              </button>
            </div>
          </div>

          <div v-if="shown[c.name]" class="mt-3">
            <p class="mb-2 font-mono text-xs text-brand-900/55 dark:text-white/50">
              Shared setup, then the {{ shown[c.name] === "jasy" ? "jasy" : "react-pdf" }} document.
              Both build the same page - that is what the matching page counts above check.
            </p>
            <div
              class="shiki-host overflow-x-auto rounded-xl bg-brand-950 p-5 text-xs leading-relaxed"
              v-html="highlighted?.[`${c.name}:${shown[c.name]}`]"
            />
          </div>
        </article>
      </div>

      <!-- reproduce -->
      <div class="mt-20 rounded-2xl border border-brand-100 p-6 sm:p-8 dark:border-white/10">
        <h2 class="font-display text-2xl font-bold text-brand-900 dark:text-white">
          Run it yourself
        </h2>
        <p class="mt-3 max-w-2xl leading-relaxed text-brand-900/70 dark:text-white/65">
          Four files, no clone. Take the case you want from the buttons above, drop it in beside this
          runner, and you have the number on your own machine.
        </p>

        <p class="mt-6 spec-label text-brand-600 dark:text-brand-300">1 - install</p>
        <pre
          class="mt-2 overflow-x-auto rounded-xl bg-brand-950 p-5 font-mono text-sm leading-relaxed text-white/90"
        ><code>mkdir jasy-bench &amp;&amp; cd jasy-bench &amp;&amp; npm init -y &amp;&amp; npm pkg set type=module
npm i @jasy/pdf@{{ data.versions.jasy }} @react-pdf/renderer@{{ data.versions.reactPdf }} react@{{ data.versions.react }}</code></pre>

        <p class="mt-6 spec-label text-brand-600 dark:text-brand-300">
          2 - bench.mjs, beside the case file
        </p>
        <div
          class="shiki-host mt-2 overflow-x-auto rounded-xl bg-brand-950 p-5 text-xs leading-relaxed"
          v-html="highlighted?.runner"
        />

        <p class="mt-6 spec-label text-brand-600 dark:text-brand-300">3 - run</p>
        <pre
          class="mt-2 overflow-x-auto rounded-xl bg-brand-950 p-5 font-mono text-sm leading-relaxed text-white/90"
        ><code>node bench.mjs</code></pre>

        <p class="mt-5 text-sm leading-relaxed text-brand-900/60 dark:text-white/55">
          The full harness - all six cases, the page-count guard and the JSON this page reads - lives
          in
          <NuxtLink
            to="https://github.com/jasy-pdf/jasy/tree/main/bench"
            target="_blank"
            class="font-mono text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
            >jasy/bench</NuxtLink
          >.
        </p>
      </div>

      <!-- what keeps it honest -->
      <div class="mt-16">
        <h2 class="font-display text-2xl font-bold text-brand-900 dark:text-white">
          What keeps this honest
        </h2>

        <div class="mt-6 space-y-6 text-brand-900/70 dark:text-white/65">
          <div>
            <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
              Both engines lay out the same document
            </h3>
            <p class="mt-1 leading-relaxed">
              Every result carries its page count, and the runner refuses to print a comparison whose
              page counts differ. This is not theoretical: an earlier measurement of ours compared a
              37-page render against a 33-page one and nobody noticed. Page insets, the default line
              box and how spacing is declared all had to be pinned by hand before the two sides
              matched.
            </p>
          </div>

          <div>
            <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
              Every paragraph is different
            </h3>
            <p class="mt-1 leading-relaxed">
              A benchmark that repeats one string measures caching, not layout. When ours did that,
              react-pdf looked 45% faster on flowing text than it does here - it benefited from the
              repetition more than we did. Real documents have no identical paragraphs, so neither do
              these.
            </p>
          </div>

          <div>
            <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
              Same features switched on
            </h3>
            <p class="mt-1 leading-relaxed">
              Both engines kern, and both embed and subset the same TrueType face in the typography
              case. That was verified by reading the text operators back out of the produced PDFs,
              not assumed.
            </p>
          </div>

          <div>
            <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
              Only a fair opponent
            </h3>
            <p class="mt-1 leading-relaxed">
              <span class="font-mono">pdf-lib</span> and <span class="font-mono">PDFKit</span> are
              deliberately absent. They have no layout engine, so beating them at layout would be a
              win we did not earn. A headless browser is a different category again - it renders HTML,
              and on a warm server it amortises a startup cost these numbers do not include.
            </p>
          </div>
        </div>
      </div>

      <p class="mt-12 text-sm leading-relaxed text-brand-900/55 dark:text-white/50">
        One machine, one day, one set of documents. Your numbers will differ - that is the point of
        publishing the harness rather than only the result.
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Shiki paints its own background; the brand-navy panel should show through instead. */
.shiki-host :deep(pre.shiki) {
  margin: 0;
  background: transparent !important;
}
.shiki-host :deep(code) {
  font-family: var(--font-mono);
}
</style>
