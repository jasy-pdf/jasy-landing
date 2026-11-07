<script setup lang="ts">
// A curated, ordered view of what's coming - no dates, no version numbers, just the themes in order.
// The full, live roadmap lives on the GitHub project board (linked below).
const { t } = useI18n();
const items = computed(() =>
  (
    [
      ["i-lucide-file-pen", "edit"],
      ["i-lucide-pen-tool", "sign"],
      ["i-lucide-layers", "layout"],
      ["i-lucide-layout-template", "templates"],
      ["i-lucide-receipt", "profiles"],
      ["i-lucide-languages", "bidi"],
    ] as const
  ).map(([icon, key]) => ({
    icon,
    title: t(`home.roadmap.${key}Title`),
    text: t(`home.roadmap.${key}Text`),
  })),
);
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <p class="spec-label text-brand-600 dark:text-brand-300">
        {{ t("home.roadmap.label1") }} <span class="text-brand-400">·</span> MIT
        <span class="text-brand-400">·</span> {{ t("home.roadmap.label3") }}
      </p>
      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        {{ t("home.roadmap.h2") }}
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        {{ t("home.roadmap.lead") }}
      </p>

      <ul class="mt-12 max-w-3xl divide-y divide-brand-100 dark:divide-white/10">
        <li
          v-for="item in items"
          :key="item.title"
          class="group flex items-start gap-5 py-6 first:pt-0 last:pb-0"
        >
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
          >
            <UIcon :name="item.icon" class="size-6" />
          </div>
          <div>
            <h3 class="font-display text-xl font-bold text-brand-900 dark:text-white">
              {{ item.title }}
            </h3>
            <p class="mt-1 leading-relaxed text-brand-900/65 dark:text-white/60">{{ item.text }}</p>
          </div>
        </li>
      </ul>

      <div class="mt-12 flex flex-wrap items-center gap-3">
        <UButton
          to="https://github.com/jasy-pdf/jasy"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="outline"
          size="lg"
          class="font-medium"
        >
          {{ t("home.roadmap.github") }}
        </UButton>
        <UButton
          to="https://github.com/orgs/jasy-pdf/projects/2"
          target="_blank"
          icon="i-lucide-list-checks"
          color="neutral"
          variant="ghost"
          size="lg"
          class="font-medium"
        >
          {{ t("home.roadmap.board") }}
        </UButton>
        <span class="font-mono text-sm text-brand-900/55 dark:text-white/50">
          {{ t("home.roadmap.welcome") }}
        </span>
      </div>
    </div>
  </section>
</template>
