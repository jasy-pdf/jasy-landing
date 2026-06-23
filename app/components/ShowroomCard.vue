<script setup lang="ts">
import VuePdfEmbed from "vue-pdf-embed";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    file: string;
    code: string;
    pdf: string;
    orientation?: "portrait" | "landscape";
    /** Optional "Validate it" link (used by the ZUGFeRD card to point at /validate). */
    validateHref?: string;
  }>(),
  { orientation: "portrait", validateHref: undefined },
);

// Portrait sheets are tall + narrow, landscape ones short + wide; the code panel matches the stage
// height so both columns line up, then "Show full source" lets the code grow past it.
const isLandscape = computed(() => props.orientation === "landscape");
const stageClass = computed(() => (isLandscape.value ? "lg:h-[26rem]" : "lg:h-[34rem]"));
const codeMaxClass = computed(() => (isLandscape.value ? "max-h-[26rem]" : "max-h-[34rem]"));
const sheetMaxClass = computed(() => (isLandscape.value ? "max-w-[560px]" : "max-w-[360px]"));

// Highlight server-side so the code is styled in the initial HTML (no flash). Keyed by file so each
// card caches independently.
const { data: codeHtml } = await useAsyncData(`shiki:${props.file}`, () =>
  highlightTs(props.code),
);

const expanded = ref(false);
const page = ref(1);
const numPages = ref(1);
const copied = ref(false);
const revealed = ref(false);

function reveal() {
  revealed.value = true;
}

// The card only hydrates once it scrolls into view (hydrate-on-visible), so revealing on the pdf's
// render event makes the paper rise in exactly as its content finishes drawing. The timeout is a
// fallback so the sheet can never stay hidden if that event is missed.
onMounted(() => setTimeout(reveal, 900));

function onLoaded(doc: { numPages?: number }) {
  numPages.value = doc?.numPages ?? 1;
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    /* clipboard blocked - ignore */
  }
}
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm dark:border-brand-800 dark:bg-brand-950/40"
  >
    <!-- card header -->
    <header class="border-b border-brand-100 px-6 py-5 dark:border-brand-800">
      <p class="spec-label text-brand-500">{{ file }}</p>
      <h3 class="mt-1 font-display text-2xl font-bold tracking-tight text-brand-900 dark:text-brand-50">
        {{ title }}
      </h3>
      <p class="mt-1 text-sm text-brand-900/60 dark:text-brand-50/60">{{ description }}</p>
    </header>

    <div class="relative grid lg:grid-cols-2">
      <!-- LEFT: code -->
      <div class="relative flex min-w-0 flex-col bg-brand-950">
        <div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span class="h-2.5 w-2.5 rounded-full bg-accent-400" />
          <span class="font-mono text-xs text-brand-200">{{ file }}</span>
          <button
            type="button"
            class="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-brand-200/80 transition hover:bg-white/10 hover:text-white"
            @click="copyCode"
          >
            <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>

        <div
          class="relative overflow-y-auto transition-[max-height] duration-300"
          :class="expanded ? 'max-h-[72rem]' : codeMaxClass"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="shiki-host px-4 py-4 text-[13px] leading-relaxed" v-html="codeHtml" />

          <!-- fade + expand affordance (only while collapsed) -->
          <div
            v-if="!expanded"
            class="pointer-events-none sticky inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent"
          >
            <button
              type="button"
              class="pointer-events-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-brand-100 backdrop-blur transition hover:bg-white/10"
              @click="expanded = true"
            >
              Show full source
              <UIcon name="i-lucide-chevron-down" class="size-3.5" />
            </button>
          </div>
        </div>

        <button
          v-if="expanded"
          type="button"
          class="flex items-center justify-center gap-1.5 border-t border-white/10 py-2 text-xs text-brand-200/80 transition hover:bg-white/5 hover:text-white"
          @click="expanded = false"
        >
          Collapse
          <UIcon name="i-lucide-chevron-up" class="size-3.5" />
        </button>
      </div>

      <!-- seam: code -> pdf (lg only) -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      >
        <span
          class="spec-label inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-brand-500 shadow-sm dark:border-brand-700 dark:bg-brand-900"
        >
          renders to <UIcon name="i-lucide-arrow-right" class="size-3.5 text-accent-500" />
        </span>
      </div>

      <!-- RIGHT: pdf as paper -->
      <div class="flex flex-col bg-brand-50/50 dark:bg-brand-950/60">
        <div class="flex flex-1 items-center justify-center overflow-auto p-6" :class="stageClass">
          <div
            class="sheet w-full overflow-hidden rounded-sm bg-white shadow-xl ring-1 ring-brand-900/5"
            :class="[sheetMaxClass, { 'is-hidden': !revealed }]"
          >
            <ClientOnly>
              <VuePdfEmbed :source="pdf" :page="page" @loaded="onLoaded" @rendered="reveal" />
              <template #fallback>
                <div class="aspect-[1/1.414] w-full animate-pulse bg-brand-100" />
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- pdf footer: pager + download -->
        <div class="flex items-center justify-between border-t border-brand-100 px-6 py-3 dark:border-brand-800">
          <div v-if="numPages > 1" class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-md p-1 text-brand-500 transition hover:bg-brand-100 disabled:opacity-30 dark:hover:bg-brand-800"
              :disabled="page <= 1"
              @click="page--"
            >
              <UIcon name="i-lucide-chevron-left" class="size-4" />
            </button>
            <span class="spec-label text-brand-500">{{ page }} / {{ numPages }}</span>
            <button
              type="button"
              class="rounded-md p-1 text-brand-500 transition hover:bg-brand-100 disabled:opacity-30 dark:hover:bg-brand-800"
              :disabled="page >= numPages"
              @click="page++"
            >
              <UIcon name="i-lucide-chevron-right" class="size-4" />
            </button>
          </div>
          <span v-else class="spec-label text-brand-500">PDF/A · 1 page</span>

          <div class="flex items-center gap-2">
            <NuxtLink
              v-if="validateHref"
              :to="validateHref"
              class="inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-200 dark:hover:bg-brand-900"
            >
              Validate it
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
            <a
              :href="pdf"
              :download="file.replace(/\.ts$/, '.pdf')"
              class="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
            >
              <UIcon name="i-lucide-download" class="size-3.5" />
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Shiki paints its own background; we want the brand-navy panel to show through. */
.shiki-host :deep(pre.shiki) {
  margin: 0;
  background: transparent !important;
}
.shiki-host :deep(code) {
  font-family: var(--font-mono);
}

/* render-reveal: the paper sheet rises + fades in once, as its PDF finishes drawing. */
.sheet {
  transition:
    opacity 0.6s ease,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet.is-hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.985);
}
@media (prefers-reduced-motion: reduce) {
  .sheet {
    transition: none;
  }
  .sheet.is-hidden {
    opacity: 1;
    transform: none;
  }
}
</style>
