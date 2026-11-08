<script setup lang="ts">
// "Why trust it" - every claim links to where it is proven. No hard-coded numbers: the benchmark page
// computes its own, and a figure copied here would go stale.
const { t } = useI18n();
const to = useLocalizedTo();
const proofs = computed(() =>
  [
    ["i-lucide-cpu", "engine", to("/docs/pdf")],
    ["i-lucide-zap", "speed", to("/react-pdf-alternative")],
    ["i-lucide-shield-check", "checked", to("/validate")],
    ["i-lucide-accessibility", "a11y", to("/docs/pdf/accessibility")],
    ["i-lucide-binary", "bytes", to("/docs/pdf/output")],
    ["i-lucide-globe", "anywhere", to("/docs")],
  ].map(([icon, key, href]) => ({
    icon,
    title: t(`home.trust.${key}Title`),
    text: t(`home.trust.${key}Text`),
    to: href,
    link: t(`home.trust.${key}Link`),
  })),
);
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <p class="spec-label text-brand-600 dark:text-brand-300">{{ t("home.trust.label") }}</p>
      <h2
        class="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        {{ t("home.trust.title") }}
      </h2>
      <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="p in proofs"
          :key="p.title"
          class="group flex flex-col rounded-2xl border border-brand-200/70 bg-white/70 p-6 shadow-sm transition-colors hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
        >
          <div
            class="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10"
          >
            <UIcon :name="p.icon" class="size-5" />
          </div>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-900 dark:text-white">
            {{ p.title }}
          </h3>
          <p class="mt-1.5 flex-1 text-sm leading-relaxed text-brand-900/65 dark:text-white/60">
            {{ p.text }}
          </p>
          <NuxtLink
            :to="p.to"
            class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
          >
            {{ p.link }}
            <UIcon
              name="i-lucide-arrow-right"
              class="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
