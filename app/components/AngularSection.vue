<script setup lang="ts">
// The Angular story: a document is a function, pdfResource() keeps a preview in sync with the signals.
// `code` is literal text (rendered via {{ code }}).
const code = `export const invoicePdf: PdfDocumentFn<Invoice> = (invoice) =>
  Document([
    Page({ gap: 12 }, [
      Text(invoice.title, { size: 30, bold: true }),
      ...invoice.lines.map((line) =>
        Row({ justify: "between" }, [
          Text(line.name),
          Text(\`\${line.total} €\`, { bold: true }),
        ]),
      ),
    ]),
  ]);

// in a component: renders again whenever the invoice changes
readonly preview = pdfResource(invoicePdf, () => this.invoice());`;

const { t } = useI18n();
const to = useLocalizedTo();
const points = computed(() => [
  {
    icon: "i-lucide-syringe",
    title: t("home.angular.p1Title"),
    text: t("home.angular.p1Text"),
  },
  {
    icon: "i-lucide-radio",
    title: t("home.angular.p2Title"),
    text: t("home.angular.p2Text"),
  },
  {
    icon: "i-lucide-terminal",
    title: t("home.angular.p3Title"),
    text: t("home.angular.p3Text"),
  },
]);
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-center gap-3">
        <p class="spec-label flex items-center gap-2 text-brand-600 dark:text-brand-300">
          <UIcon name="i-simple-icons-angular" class="size-4 text-rose-500" />
          {{ t("home.angular.label") }}
        </p>
        <span
          class="spec-label rounded-full bg-accent-400/15 px-2.5 py-1 text-brand-700 ring-1 ring-inset ring-accent-400/40 dark:text-accent-300"
          >{{ t("home.angular.badge") }}</span
        >
      </div>

      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        {{ t("home.angular.h2Before") }}
        <span class="relative whitespace-nowrap">
          {{ t("home.angular.h2Highlight")
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
        >.
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        {{ t("home.angular.lead") }}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink
          :to="to('/docs/angular')"
          class="group inline-flex items-center gap-1.5 font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          {{ t("home.angular.guide") }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
        <code
          class="rounded bg-brand-50 px-2 py-1 font-mono text-sm text-brand-700 dark:bg-white/10 dark:text-brand-200"
          >ng add @jasy/angular</code
        >
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
        <!-- the code -->
        <div
          class="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div
            class="flex items-center gap-2 border-b border-brand-100 px-4 py-2.5 dark:border-white/10"
          >
            <UIcon name="i-lucide-file-code" class="size-4 text-brand-400 dark:text-brand-300" />
            <span class="font-mono text-xs text-brand-600 dark:text-brand-300">invoice.pdf.ts</span>
          </div>
          <pre
            class="overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
          ><code>{{ code }}</code></pre>
          <div
            class="overflow-x-auto whitespace-nowrap border-t border-brand-100 px-4 py-3 font-mono text-xs text-brand-600 dark:border-white/10 dark:text-brand-300"
          >
            &lt;iframe [src]="preview.latest()?.safeUrl"&gt;
            <span class="text-brand-400 dark:text-white/45">{{ t("home.angular.inBrowser") }}</span>
          </div>
        </div>

        <!-- the points -->
        <ul class="space-y-6">
          <li v-for="p in points" :key="p.title" class="group flex items-start gap-5">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
            >
              <UIcon :name="p.icon" class="size-6" />
            </div>
            <div>
              <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
                {{ p.title }}
              </h3>
              <p class="mt-1 leading-relaxed text-brand-900/65 dark:text-white/60">{{ p.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
