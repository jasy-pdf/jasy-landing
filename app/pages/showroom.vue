<script setup lang="ts">
definePageMeta({ i18n: { locales: ["en", "de"] } });

import invoiceCode from "~/showroom-sources/invoice.ts?raw";
import stampedInvoiceCode from "~/showroom-sources/stamped-invoice.ts?raw";
import zugferdCode from "~/showroom-sources/zugferd-invoice.ts?raw";
import paginatedReportCode from "~/showroom-sources/paginated-report.ts?raw";
import pageBreaksCode from "~/showroom-sources/page-breaks.ts?raw";
import handbookCode from "~/showroom-sources/handbook.ts?raw";
import certificateCode from "~/showroom-sources/certificate.ts?raw";
import coverCode from "~/showroom-sources/cover.ts?raw";
import datasheetCode from "~/showroom-sources/datasheet.ts?raw";
import articleCode from "~/showroom-sources/article.ts?raw";
import letterCode from "~/showroom-sources/letter.ts?raw";
import bannerCode from "~/showroom-sources/banner.ts?raw";
import labelCode from "~/showroom-sources/label.ts?raw";
import chartCode from "~/showroom-sources/chart.ts?raw";
import vectorLogoCode from "~/showroom-sources/vector-logo.ts?raw";
import formCode from "~/showroom-sources/form.ts?raw";

const { t, locale } = useI18n();
const title = computed(() => t("showroom.title"));
const description = computed(() => t("showroom.description"));
useHead({ title });
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
});

const sources = [
  {
    key: "invoice",
    file: "invoice.ts",
    code: invoiceCode,
    pdf: "/showroom/invoice.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "stampedInvoice",
    file: "stamped-invoice.ts",
    code: stampedInvoiceCode,
    pdf: "/showroom/stamped-invoice.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "vectorLogo",
    file: "vector-logo.ts",
    code: vectorLogoCode,
    pdf: "/showroom/vector-logo.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "chart",
    file: "chart.ts",
    code: chartCode,
    pdf: "/showroom/chart.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "paginatedReport",
    file: "paginated-report.ts",
    code: paginatedReportCode,
    pdf: "/showroom/paginated-report.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "pageBreaks",
    file: "page-breaks.ts",
    code: pageBreaksCode,
    pdf: "/showroom/page-breaks.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "handbook",
    file: "handbook.ts",
    code: handbookCode,
    pdf: "/showroom/handbook.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "form",
    file: "form.ts",
    code: formCode,
    pdf: "/showroom/form.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "zugferdInvoice",
    file: "zugferd-invoice.ts",
    code: zugferdCode,
    pdf: "/showroom/zugferd-invoice.pdf",
    orientation: "portrait" as const,
    validateHref: "/validate",
    pdfa: true,
  },
  {
    key: "certificate",
    file: "certificate.ts",
    code: certificateCode,
    pdf: "/showroom/certificate.pdf",
    orientation: "landscape" as const,
  },
  {
    key: "cover",
    file: "cover.ts",
    code: coverCode,
    pdf: "/showroom/cover.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "datasheet",
    file: "datasheet.ts",
    code: datasheetCode,
    pdf: "/showroom/datasheet.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "article",
    file: "article.ts",
    code: articleCode,
    pdf: "/showroom/article.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "letter",
    file: "letter.ts",
    code: letterCode,
    pdf: "/showroom/letter.pdf",
    orientation: "portrait" as const,
  },
  {
    key: "banner",
    file: "banner.ts",
    code: bannerCode,
    pdf: "/showroom/banner.pdf",
    orientation: "landscape" as const,
  },
  {
    key: "label",
    file: "label.ts",
    code: labelCode,
    pdf: "/showroom/label.pdf",
    orientation: "portrait" as const,
  },
];
const cards = computed(() =>
  sources.map(({ key, ...card }) => ({
    ...card,
    title: t(`showroom.cards.${key}.title`),
    description: t(`showroom.cards.${key}.description`),
  })),
);
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <!-- header -->
      <div class="max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          showroom <span class="text-brand-400">·</span> {{ t("showroom.label2") }}
          <span class="text-brand-400">·</span> {{ t("showroom.label3") }}
        </p>

        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          {{ t("showroom.h1Before") }}
          <span class="relative whitespace-nowrap">
            {{ t("showroom.h1Highlight") }}
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
          {{ t("showroom.h1After") }}
        </h1>

        <i18n-t
          keypath="showroom.lead"
          tag="p"
          scope="global"
          class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65"
        >
          <template #pkg>
            <span class="font-medium text-brand-900 dark:text-white">@jasy/pdf</span>
          </template>
        </i18n-t>
        <p v-if="locale !== 'en'" class="mt-3 text-sm text-brand-900/55 dark:text-white/50">
          {{ t("showroom.note") }}
        </p>
      </div>

      <!-- cards: each hydrates (and renders its PDF) only once it scrolls into view -->
      <div class="mt-14 space-y-16">
        <LazyShowroomCard v-for="c in cards" :key="c.file" v-bind="c" hydrate-on-visible />
      </div>
    </div>
  </section>
</template>
