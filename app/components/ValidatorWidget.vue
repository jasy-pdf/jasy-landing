<script setup lang="ts">
/**
 * The validator widget: drop an invoice, run the OFFICIAL checks (EN 16931 + PDF/A-3 + veraPDF) via
 * the validator service, and show the verdict. The point is trust by verification - so the result is
 * an inspection ledger, not a black box, and the file never leaves the round trip (deleted server-side).
 */
type Violation = { id?: string; text: string };
type Report = {
  file: string;
  summary: string;
  recognized: boolean;
  valid: boolean;
  businessRules:
    | { kind: string; profile: string; valid: boolean; errors: Violation[]; warnings: Violation[] }
    | null;
  pdfA3:
    | { valid: boolean; passed: number; total: number; checks: { id: string; label: string; ok: boolean; detail?: string }[] }
    | null;
  veraPdf:
    | { available: boolean; valid?: boolean; profile?: string; failedRules?: number; failures?: { clause: string; failedChecks: number }[] }
    | null;
};

type State = "idle" | "ready" | "validating" | "done" | "error";

const state = ref<State>("idle");
const file = ref<File | null>(null);
const previewUrl = ref("");
const isPdf = ref(false);
const report = ref<Report | null>(null);
const errorMsg = ref("");
const dragging = ref(false);
const stepIndex = ref(0);
const showAllPdfa = ref(false);

const STEPS = [
  "Extracting the embedded XML",
  "Checking EN 16931 business rules",
  "Running veraPDF (ISO 19005)",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function pickFile(f: File) {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  file.value = f;
  isPdf.value = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
  previewUrl.value = isPdf.value ? URL.createObjectURL(f) : "";
  report.value = null;
  errorMsg.value = "";
  state.value = "ready";
}

function onInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) pickFile(f);
}
function onDrop(e: DragEvent) {
  dragging.value = false;
  const f = e.dataTransfer?.files?.[0];
  if (f) pickFile(f);
}

async function runValidation(blob: Blob) {
  state.value = "validating";
  stepIndex.value = 0;
  report.value = null;
  errorMsg.value = "";
  showAllPdfa.value = false;

  // Pace the three real stages so the work is felt - but never block on the animation.
  let stepping = true;
  const animate = (async () => {
    for (let i = 0; i < STEPS.length && stepping; i++) {
      stepIndex.value = i;
      await sleep(680);
    }
  })();

  try {
    const data = await $fetch<Report | { error: string }>("/api/validate", {
      method: "POST",
      body: blob,
      headers: { "content-type": blob.type || "application/octet-stream" },
    });
    stepping = false;
    await animate;
    await sleep(220);
    if (data && "valid" in data) {
      report.value = data as Report;
      state.value = "done";
    } else {
      errorMsg.value = (data as { error: string })?.error || "Unexpected response.";
      state.value = "error";
    }
  } catch (e: unknown) {
    stepping = false;
    // The validator's own errors arrive as a string in data.error; pick a human message and never
    // surface a framework error shape (a bare `true`, a 404 body) to the reader.
    const d = (e as { data?: { error?: unknown; message?: string } })?.data;
    errorMsg.value =
      (typeof d?.error === "string" && d.error) ||
      d?.message ||
      "We couldn't reach the validator. Please try again in a moment.";
    state.value = "error";
  }
}

function validateCurrent() {
  if (file.value) runValidation(file.value);
}

async function validateSample() {
  const res = await fetch("/sample-invoice.pdf");
  const blob = await res.blob();
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  file.value = new File([blob], "jasy-sample-invoice.pdf", { type: "application/pdf" });
  isPdf.value = true;
  previewUrl.value = URL.createObjectURL(blob);
  runValidation(blob);
}

function reset() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  file.value = null;
  previewUrl.value = "";
  report.value = null;
  errorMsg.value = "";
  state.value = "idle";
}

const verdict = computed<"valid" | "invalid" | "unrecognized" | null>(() => {
  const r = report.value;
  if (!r) return null;
  if (!r.recognized) return "unrecognized";
  return r.valid ? "valid" : "invalid";
});

const issueCount = computed(() => {
  const r = report.value;
  if (!r) return 0;
  let n = 0;
  if (r.businessRules) n += r.businessRules.errors.length;
  if (r.pdfA3) n += r.pdfA3.checks.filter((c) => !c.ok).length;
  if (r.veraPdf?.available && r.veraPdf.valid === false)
    n += r.veraPdf.failedRules ?? r.veraPdf.failures?.length ?? 1;
  return n;
});

const prettyName = computed(() => file.value?.name ?? "");
const prettySize = computed(() => {
  const b = file.value?.size ?? 0;
  return b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
});

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<template>
  <div
    class="relative rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
  >
    <!-- corner registration ticks, like the hero -->
    <span class="pointer-events-none absolute left-3 top-3 size-2.5 border-l-2 border-t-2 border-brand-300 dark:border-brand-400/50" aria-hidden="true" />
    <span class="pointer-events-none absolute right-3 top-3 size-2.5 border-r-2 border-t-2 border-brand-300 dark:border-brand-400/50" aria-hidden="true" />

    <!-- ========== IDLE: drop zone ========== -->
    <div v-if="state === 'idle'" class="p-5 sm:p-8">
      <label
        class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-all duration-150"
        :class="dragging
          ? 'scale-[1.01] border-brand-500 bg-brand-50 ring-4 ring-brand-400/15 dark:bg-brand-400/10'
          : 'border-brand-300/70 hover:border-brand-400 hover:bg-brand-50/40 dark:border-white/15 dark:hover:bg-white/5'"
        @dragenter.prevent="dragging = true"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <!-- pointer-events-none so child elements don't fire dragleave (which would flicker the state) -->
        <div class="pointer-events-none flex flex-col items-center gap-3">
          <UIcon
            :name="dragging ? 'i-lucide-download' : 'i-lucide-file-up'"
            class="size-9 transition-colors"
            :class="dragging ? 'text-brand-600 dark:text-brand-200' : 'text-brand-500 dark:text-brand-300'"
          />
          <div>
            <p class="font-display text-lg font-semibold text-brand-900 dark:text-white">
              {{ dragging ? "Drop to inspect" : "Drop your invoice here" }}
            </p>
            <p class="mt-1 text-sm text-brand-900/60 dark:text-white/55">
              A ZUGFeRD or XRechnung PDF (or the raw XML), made by any tool. Or click to choose.
            </p>
          </div>
          <span class="spec-label mt-1 rounded-full bg-brand-900/90 px-3 py-1 text-accent-400">
            processed in memory · never stored · deleted instantly
          </span>
        </div>
        <input type="file" accept=".pdf,.xml,application/pdf,text/xml,application/xml" class="hidden" @change="onInput" />
      </label>
    </div>

    <!-- ========== READY: preview + validate ========== -->
    <div v-else-if="state === 'ready'" class="grid gap-5 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
      <div class="flex items-center gap-4 overflow-hidden">
        <div class="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-brand-200">
          <UIcon :name="isPdf ? 'i-lucide-file-text' : 'i-lucide-file-code-2'" class="size-6" />
        </div>
        <div class="min-w-0">
          <p class="truncate font-medium text-brand-900 dark:text-white">{{ prettyName }}</p>
          <p class="spec-label mt-0.5 text-brand-500 dark:text-brand-300">
            {{ prettySize }} · ready to inspect
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <UButton color="neutral" variant="ghost" icon="i-lucide-x" label="Discard" @click="reset" />
        <UButton color="primary" size="lg" icon="i-lucide-shield-check" label="Validate" class="font-medium" @click="validateCurrent" />
      </div>
    </div>

    <!-- ========== VALIDATING: the real stages ========== -->
    <div v-else-if="state === 'validating'" class="p-6 sm:p-10">
      <p class="spec-label text-brand-500 dark:text-brand-300">running the official checks</p>
      <ul class="mt-5 space-y-3">
        <li v-for="(step, i) in STEPS" :key="step" class="flex items-center gap-3">
          <span class="grid size-6 place-items-center">
            <UIcon v-if="i < stepIndex" name="i-lucide-check" class="size-5 text-emerald-600" />
            <UIcon v-else-if="i === stepIndex" name="i-lucide-loader-circle" class="size-5 animate-spin text-brand-500" />
            <span v-else class="size-2 rounded-full bg-brand-300/60" />
          </span>
          <span
            class="text-sm"
            :class="i <= stepIndex ? 'text-brand-900 dark:text-white' : 'text-brand-900/40 dark:text-white/35'"
          >
            {{ step }}
          </span>
        </li>
      </ul>
    </div>

    <!-- ========== ERROR ========== -->
    <div v-else-if="state === 'error'" class="p-6 sm:p-10">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-6 shrink-0 text-amber-600" />
        <div>
          <p class="font-medium text-brand-900 dark:text-white">Couldn't run the check</p>
          <p class="mt-1 text-sm text-brand-900/65 dark:text-white/60">{{ errorMsg }}</p>
        </div>
      </div>
      <UButton class="mt-5" color="neutral" variant="outline" icon="i-lucide-rotate-ccw" label="Try another file" @click="reset" />
    </div>

    <!-- ========== DONE: verdict + ledger ========== -->
    <div v-else-if="state === 'done' && report" class="p-5 sm:p-8">
      <!-- the signature: a conformance stamp -->
      <div
        class="verdict flex items-center gap-4 rounded-xl border-2 px-5 py-4"
        :class="{
          'border-emerald-500/70 bg-emerald-50/70 dark:bg-emerald-500/10': verdict === 'valid',
          'border-red-400/70 bg-red-50/70 dark:bg-red-500/10': verdict === 'invalid',
          'border-brand-300 bg-brand-50/70 dark:border-white/15 dark:bg-white/5': verdict === 'unrecognized',
        }"
      >
        <UIcon
          :name="verdict === 'valid' ? 'i-lucide-badge-check' : verdict === 'invalid' ? 'i-lucide-badge-x' : 'i-lucide-file-question'"
          class="size-10 shrink-0"
          :class="verdict === 'valid' ? 'text-emerald-600' : verdict === 'invalid' ? 'text-red-500' : 'text-brand-500'"
        />
        <div class="min-w-0">
          <p
            class="font-display text-2xl font-bold tracking-tight sm:text-3xl"
            :class="verdict === 'valid' ? 'text-emerald-700 dark:text-emerald-400' : verdict === 'invalid' ? 'text-red-600 dark:text-red-400' : 'text-brand-800 dark:text-white'"
          >
            <template v-if="verdict === 'valid'">Valid e-invoice</template>
            <template v-else-if="verdict === 'invalid'">Not valid · {{ issueCount }} issue{{ issueCount === 1 ? '' : 's' }}</template>
            <template v-else>Not a ZUGFeRD / XRechnung file</template>
          </p>
          <p class="spec-label mt-1 text-brand-500 dark:text-brand-300">{{ report.summary }}</p>
        </div>
      </div>

      <!-- inspection ledger: the three authorities -->
      <div v-if="verdict !== 'unrecognized'" class="mt-5 space-y-3">
        <!-- EN 16931 -->
        <section v-if="report.businessRules" class="rounded-lg border border-brand-200/70 p-4 dark:border-white/10">
          <header class="flex items-center justify-between gap-3">
            <span class="font-medium text-brand-900 dark:text-white">{{ report.businessRules.kind }} business rules</span>
            <span class="inline-flex items-center gap-1.5 text-sm font-medium" :class="report.businessRules.valid ? 'text-emerald-600' : 'text-red-500'">
              <UIcon :name="report.businessRules.valid ? 'i-lucide-check' : 'i-lucide-x'" class="size-4" />
              {{ report.businessRules.valid ? "valid" : `${report.businessRules.errors.length} error${report.businessRules.errors.length === 1 ? '' : 's'}` }}
            </span>
          </header>
          <ul v-if="report.businessRules.errors.length" class="mt-3 space-y-1.5">
            <li v-for="(e, i) in report.businessRules.errors" :key="i" class="flex gap-2 text-sm text-brand-900/75 dark:text-white/70">
              <UIcon name="i-lucide-x" class="mt-0.5 size-4 shrink-0 text-red-500" />
              <span><code v-if="e.id" class="font-mono text-xs text-brand-600 dark:text-brand-300">[{{ e.id }}]</code> {{ e.text }}</span>
            </li>
          </ul>
        </section>

        <!-- PDF/A-3 -->
        <section v-if="report.pdfA3" class="rounded-lg border border-brand-200/70 p-4 dark:border-white/10">
          <header class="flex items-center justify-between gap-3">
            <span class="font-medium text-brand-900 dark:text-white">PDF/A-3 structure</span>
            <span class="inline-flex items-center gap-1.5 text-sm font-medium" :class="report.pdfA3.valid ? 'text-emerald-600' : 'text-red-500'">
              <UIcon :name="report.pdfA3.valid ? 'i-lucide-check' : 'i-lucide-x'" class="size-4" />
              {{ report.pdfA3.passed }}/{{ report.pdfA3.total }}
            </span>
          </header>
          <button
            class="spec-label mt-2 text-brand-500 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            @click="showAllPdfa = !showAllPdfa"
          >
            {{ showAllPdfa ? "hide checks" : "show all checks" }}
          </button>
          <ul v-if="showAllPdfa" class="mt-2 grid gap-1.5 sm:grid-cols-2">
            <li v-for="c in report.pdfA3.checks" :key="c.id" class="flex items-center gap-2 text-sm" :class="c.ok ? 'text-brand-900/70 dark:text-white/65' : 'text-red-500'">
              <UIcon :name="c.ok ? 'i-lucide-check' : 'i-lucide-x'" class="size-4 shrink-0" :class="c.ok ? 'text-emerald-600' : 'text-red-500'" />
              {{ c.label }}
            </li>
          </ul>
        </section>

        <!-- veraPDF -->
        <section v-if="report.veraPdf" class="rounded-lg border border-brand-200/70 p-4 dark:border-white/10">
          <header class="flex items-center justify-between gap-3">
            <span class="font-medium text-brand-900 dark:text-white">
              veraPDF <span class="text-brand-500 dark:text-brand-300">· ISO 19005</span>
            </span>
            <span v-if="report.veraPdf.available" class="inline-flex items-center gap-1.5 text-sm font-medium" :class="report.veraPdf.valid ? 'text-emerald-600' : 'text-red-500'">
              <UIcon :name="report.veraPdf.valid ? 'i-lucide-check' : 'i-lucide-x'" class="size-4" />
              {{ report.veraPdf.valid ? "compliant" : `${report.veraPdf.failedRules ?? report.veraPdf.failures?.length ?? 0} failed` }}
            </span>
            <span v-else class="spec-label text-brand-400">not run</span>
          </header>
          <p v-if="report.veraPdf.available && report.veraPdf.profile" class="spec-label mt-1.5 text-brand-500 dark:text-brand-300">
            {{ report.veraPdf.profile }}
          </p>
          <ul v-if="report.veraPdf.failures?.length" class="mt-3 space-y-1.5">
            <li v-for="(f, i) in report.veraPdf.failures" :key="i" class="flex gap-2 text-sm text-brand-900/75 dark:text-white/70">
              <UIcon name="i-lucide-x" class="mt-0.5 size-4 shrink-0 text-red-500" />
              <span>ISO clause {{ f.clause }} <span class="text-brand-400">({{ f.failedChecks }} checks)</span></span>
            </li>
          </ul>
        </section>

        <p class="text-xs leading-relaxed text-brand-900/55 dark:text-white/50">
          Validated with veraPDF, the PDF Association's official open-source PDF/A validator, and the
          EN 16931 (KoSIT) business rules. jasy only runs them - the verdict is theirs.
        </p>
      </div>

      <!-- punchline + next step -->
      <div class="mt-6 flex flex-wrap items-center gap-2.5">
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" label="Check another" @click="reset" />
        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-sparkles"
          label="Now validate one jasy made"
          @click="validateSample"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.verdict {
  animation: stamp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes stamp {
  from {
    opacity: 0;
    transform: scale(1.04);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .verdict {
    animation: none;
  }
}
</style>
