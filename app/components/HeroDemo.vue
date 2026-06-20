<script setup lang="ts">
/**
 * The hero centerpiece. A typewriter types the JasyPDF source on the left; each line that
 * constructs a component fires an `emit` id, and the matching block flies into the PDF page on
 * the right - so you watch code become paper in real time. Loops; respects reduced motion.
 */

type Line = { t: string; emit?: string };

const SCRIPT: Line[] = [
  {
    t: 'import { Document, Page, Text, Table, Box, Row, Padding, Divider, renderToBytes } from "@jasy/pdf"',
  },
  { t: "" },
  { t: "const invoice = Document([" },
  { t: '  Page({ size: "A4", margin: 48 }, [' },
  {
    t: '    Text("Invoice #2026-014", { size: 26, bold: true, color: "steelblue" }),',
    emit: "title",
  },
  { t: '    Text("Acme GmbH · Berlin", { size: 11, color: "gray" }),', emit: "subtitle" },
  { t: '    Divider({ color: "steelblue" }),', emit: "divider" },
  {
    t: '    Table({ columns: ["auto", "1fr", "auto"], header: ["Qty", "Item", "Amount"], rule: "#e0e0e0" }, [',
    emit: "thead",
  },
  { t: '      ["2", "Design", "1,200 €"],', emit: "r1" },
  { t: '      ["8", "Build", "6,400 €"],', emit: "r2" },
  { t: "    ])," },
  { t: '    Padding({ top: 16 }, Box({ bg: "#1450aa11", padding: 12, radius: 6 }, [' },
  { t: '      Row({ justify: "between", align: "center" }, [' },
  { t: '        Text("Total due", { size: 12, color: "gray" }),' },
  {
    t: '        Text("7,600 €", { size: 18, bold: true }),',
    emit: "total",
  },
  { t: "      ])," },
  { t: "    ]))," },
  { t: "  ])," },
  { t: "])" },
  { t: "" },
  {
    t: "const pdf = await renderToBytes(invoice)  // → the PDF bytes, pure TypeScript",
    emit: "badges",
  },
];

const ALL_EMITS = SCRIPT.map((l) => l.emit).filter(Boolean) as string[];

const KEYWORDS = new Set(["import", "from", "const", "await"]);
const FUNCS = new Set([
  "Document",
  "Page",
  "Text",
  "Table",
  "Box",
  "Row",
  "Padding",
  "Divider",
  "renderToBytes",
]);
const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d[\d,.]*\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$"]+)/g;

type Tok = [cls: string, text: string];

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line))) {
    if (m[1]) out.push(["c", m[1]]);
    else if (m[2]) out.push(["s", m[2]]);
    else if (m[3]) out.push(["n", m[3]]);
    else if (m[4]) out.push([KEYWORDS.has(m[4]) ? "k" : FUNCS.has(m[4]) ? "f" : "p", m[4]]);
    else if (m[5]) out.push(["p", m[5]]);
    else out.push(["x", m[6]!]);
  }
  // Light pass: a word immediately before ':' is a prop key.
  for (let i = 0; i < out.length; i++) {
    if (out[i]![0] === "p" && out[i + 1]?.[1]?.startsWith(":")) out[i]![0] = "key";
  }
  return out;
}

function sliceTokens(toks: Tok[], n: number): Tok[] {
  const out: Tok[] = [];
  let left = n;
  for (const [cls, text] of toks) {
    if (left <= 0) break;
    if (text.length <= left) {
      out.push([cls, text]);
      left -= text.length;
    } else {
      out.push([cls, text.slice(0, left)]);
      left = 0;
    }
  }
  return out;
}

const TOK_CLASS: Record<string, string> = {
  k: "text-indigo-300",
  f: "text-sky-300",
  s: "text-accent-300",
  n: "text-emerald-300",
  key: "text-brand-200",
  c: "text-slate-500 italic",
  p: "text-slate-300",
  x: "text-slate-400",
};

// Pre-tokenize once; typing only slices.
const TOKENS = SCRIPT.map((l) => tokenize(l.t));

const li = ref(0);
const ci = ref(0);
const shown = reactive(new Set<string>());

const lines = computed(() =>
  SCRIPT.map((l, i) => {
    if (i < li.value) return { num: i + 1, toks: TOKENS[i]!, active: false };
    if (i === li.value)
      return { num: i + 1, toks: sliceTokens(TOKENS[i]!, ci.value), active: true };
    return { num: i + 1, toks: [] as Tok[], active: false };
  }),
);

const has = (id: string) => shown.has(id);

let timer: ReturnType<typeof setTimeout> | undefined;

function reveal() {
  for (const id of ALL_EMITS) shown.add(id);
  li.value = SCRIPT.length;
  ci.value = 0;
}

function reset() {
  shown.clear();
  li.value = 0;
  ci.value = 0;
}

function step() {
  const line = SCRIPT[li.value];
  if (!line) {
    // Finished the script - hold, then loop.
    timer = setTimeout(() => {
      reset();
      timer = setTimeout(step, 600);
    }, 10_000);
    return;
  }

  if (ci.value < line.t.length) {
    ci.value++;
    const next = line.t[ci.value - 1];
    timer = setTimeout(step, next === " " ? 12 : 18 + Math.random() * 34);
  } else {
    if (line.emit) shown.add(line.emit);
    li.value++;
    ci.value = 0;
    timer = setTimeout(step, line.t.length === 0 ? 60 : 140);
  }
}

onMounted(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    reveal();
    return;
  }
  timer = setTimeout(step, 500);
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="grid items-center gap-7 lg:grid-cols-[1fr_auto_1fr] lg:gap-5">
    <!-- Source: the spec -->
    <div
      class="overflow-hidden rounded-xl border border-brand-900/10 bg-brand-950 shadow-2xl shadow-brand-900/20 ring-1 ring-white/5 dark:border-white/10"
    >
      <div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span class="size-2.5 rounded-full bg-red-400/80" />
        <span class="size-2.5 rounded-full bg-amber-400/80" />
        <span class="size-2.5 rounded-full bg-emerald-400/80" />
        <span class="ml-2 font-mono text-xs text-white/40">invoice.ts</span>
      </div>
      <div class="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.65] sm:text-[13px]">
        <div v-for="ln in lines" :key="ln.num" class="flex whitespace-pre">
          <span class="mr-4 w-5 shrink-0 select-none text-right text-white/20">{{ ln.num }}</span>
          <code class="min-h-[1.65em]"
            ><span v-for="(t, idx) in ln.toks" :key="idx" :class="TOK_CLASS[t[0]]">{{ t[1] }}</span
            ><span v-if="ln.active" class="caret"
          /></code>
        </div>
      </div>
    </div>

    <!-- Connector: horizontal "renders to" on every breakpoint; a dimension line on desktop, a
         down-arrow on mobile where the panels stack. -->
    <div class="flex items-center justify-center gap-2">
      <div class="hidden h-px w-8 bg-gradient-to-r from-transparent to-brand-400 lg:block" />
      <UIcon name="i-lucide-arrow-down" class="size-5 text-brand-400 lg:hidden" />
      <span class="spec-label whitespace-nowrap text-brand-500 dark:text-brand-300"
        >renders to</span
      >
      <div class="hidden h-px w-8 bg-gradient-to-l from-transparent to-brand-400 lg:block" />
    </div>

    <!-- Artifact: the page. Every block stays mounted so the card holds its full height from the
         first frame; only opacity/transform animate, so nothing reflows as blocks fly in. -->
    <div
      class="mx-auto w-full max-w-md rounded-md bg-white p-7 text-brand-900 shadow-2xl shadow-brand-900/25 ring-1 ring-brand-900/10 sm:p-8"
    >
      <h3
        class="pdf-el text-2xl font-bold tracking-tight text-brand-600"
        :class="{ 'is-hidden': !has('title') }"
      >
        Invoice #2026-014
      </h3>
      <p class="pdf-el mt-1 text-sm text-slate-400" :class="{ 'is-hidden': !has('subtitle') }">
        Acme GmbH · Berlin
      </p>
      <hr
        class="pdf-el my-4 border-t-2 border-brand-300"
        :class="{ 'is-hidden': !has('divider') }"
      />

      <div class="space-y-px">
        <div
          class="pdf-el grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-slate-200 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
          :class="{ 'is-hidden': !has('thead') }"
        >
          <span>Qty</span><span>Item</span><span class="text-right">Amount</span>
        </div>
        <div
          class="pdf-el grid grid-cols-[auto_1fr_auto] gap-x-4 py-1.5 text-sm"
          :class="{ 'is-hidden': !has('r1') }"
        >
          <span class="tabular-nums text-slate-500">2</span><span>Design</span
          ><span class="text-right tabular-nums">1,200 €</span>
        </div>
        <div
          class="pdf-el grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-slate-200 py-1.5 text-sm"
          :class="{ 'is-hidden': !has('r2') }"
        >
          <span class="tabular-nums text-slate-500">8</span><span>Build</span
          ><span class="text-right tabular-nums">6,400 €</span>
        </div>
      </div>

      <div
        class="pdf-el mt-4 flex items-center justify-between rounded-md bg-brand-50 px-4 py-3 ring-1 ring-brand-100"
        :class="{ 'is-hidden': !has('total') }"
      >
        <span class="text-sm font-medium text-slate-500">Total due</span>
        <span class="text-lg font-bold tabular-nums text-brand-700">7,600 €</span>
      </div>

      <div class="pdf-el mt-5 flex flex-wrap gap-2" :class="{ 'is-hidden': !has('badges') }">
        <span
          v-for="b in ['ZUGFeRD', 'XRechnung', 'PDF/A-3']"
          :key="b"
          class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
        >
          <UIcon name="i-lucide-check" class="size-3.5" />{{ b }}
        </span>
      </div>
    </div>
  </div>
</template>
