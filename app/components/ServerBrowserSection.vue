<script setup lang="ts">
// One engine, two runtimes. The same component code renders byte-identically on a server or in the browser.
const { t } = useI18n();
const runtimes = computed(() => [
  {
    icon: "i-lucide-server",
    label: t("home.runtimes.serverLabel"),
    title: "Node, Nitro, Lambda, Workers",
    text: t("home.runtimes.serverText"),
  },
  {
    icon: "i-lucide-globe",
    label: t("home.runtimes.browserLabel"),
    title: t("home.runtimes.browserTitle"),
    text: t("home.runtimes.browserText"),
  },
]);
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <p class="spec-label text-brand-600 dark:text-brand-300">
        {{ t("home.runtimes.label1") }} <span class="text-brand-400">·</span>
        {{ t("home.runtimes.label2") }} <span class="text-brand-400">·</span>
        {{ t("home.runtimes.label3") }}
      </p>
      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        {{ t("home.runtimes.h2Before") }}
        <span class="relative whitespace-nowrap">
          {{ t("home.runtimes.h2Highlight") }}
          <svg
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
            />
          </svg>
        </span>
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        {{ t("home.runtimes.lead") }}
      </p>

      <div class="mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
        <div
          v-for="r in runtimes"
          :key="r.label"
          class="group rounded-2xl border border-brand-200/70 bg-white/60 p-6 shadow-sm backdrop-blur transition-colors hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
        >
          <div
            class="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
          >
            <UIcon :name="r.icon" class="size-6" />
          </div>
          <p class="spec-label mt-4 text-brand-600 dark:text-brand-300">{{ r.label }}</p>
          <h3 class="mt-1 font-display text-xl font-bold text-brand-900 dark:text-white">
            {{ r.title }}
          </h3>
          <p class="mt-2 leading-relaxed text-brand-900/65 dark:text-white/60">{{ r.text }}</p>
        </div>
      </div>

      <!-- the punchline: one call, both places -->
      <div
        class="mt-8 inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-xl bg-brand-900 px-4 py-3 font-mono text-sm text-white/90 dark:bg-white/5 dark:ring-1 dark:ring-white/10"
      >
        <span class="shrink-0 text-accent-400">$</span>
        <code class="whitespace-nowrap"
          >const bytes = await renderToBytes(doc)
          <span class="text-white/45">{{ t("home.runtimes.sameCall") }}</span></code
        >
      </div>
    </div>
  </section>
</template>
