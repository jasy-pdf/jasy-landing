<script setup lang="ts">
// One page in two languages: /validate and /de/e-rechnung-pruefen (the German search term as its path).
definePageMeta({
  i18n: { locales: ["en", "de"], paths: { en: "/validate", de: "/e-rechnung-pruefen" } },
});

const { t, locale } = useI18n();
const localizedTo = useLocalizedTo();
const title = computed(() => t("validate.title"));
const description = computed(() => t("validate.description"));
useHead({ title });
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
});

const authorities = computed(() => [
  { label: "veraPDF", sub: "ISO 19005 / PDF-A" },
  { label: "EN 16931", sub: t("validate.rules") },
]);
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-368 px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div class="mx-auto max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          {{ t("validate.label") }}
        </p>

        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          {{ t("validate.headline.before") }}
          <span class="relative whitespace-nowrap">
            {{ t("validate.headline.highlight") }}
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
          {{ t("validate.headline.after") }}
        </h1>

        <i18n-t
          keypath="validate.intro"
          tag="p"
          scope="global"
          class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65"
        >
          <template #any>
            <span class="font-medium text-brand-900 dark:text-white">{{ t("validate.any") }}</span>
          </template>
        </i18n-t>

        <ul class="mt-6 flex flex-wrap gap-2.5">
          <li
            v-for="a in authorities"
            :key="a.label"
            class="inline-flex items-baseline gap-2 rounded-full border border-brand-200/80 bg-white/60 px-3.5 py-1.5 dark:border-white/10 dark:bg-white/5"
          >
            <span class="text-sm font-semibold text-brand-800 dark:text-brand-100">{{
              a.label
            }}</span>
            <span class="spec-label text-brand-400">{{ a.sub }}</span>
          </li>
        </ul>

        <div class="mt-9">
          <ValidatorWidget />
        </div>

        <div class="mt-10 border-t border-brand-200/60 pt-7 dark:border-white/10">
          <i18n-t
            keypath="validate.outro"
            tag="p"
            scope="global"
            class="text-brand-900/70 dark:text-white/65"
          >
            <template #link>
              <NuxtLink
                v-if="locale === 'de'"
                :to="localizedTo('/e-rechnung')"
                class="font-medium text-brand-700 underline dark:text-brand-300"
                >{{ t("validate.outroLink") }}</NuxtLink
              >
            </template>
          </i18n-t>
          <div class="mt-4 flex flex-wrap items-center gap-2.5">
            <UButton
              to="/docs/invoicing"
              color="primary"
              variant="outline"
              icon="i-lucide-book-open"
              :label="t('validate.docs')"
              class="font-medium"
            />
            <UButton
              to="https://github.com/jasy-pdf"
              target="_blank"
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-github"
              :label="t('validate.openSource')"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
