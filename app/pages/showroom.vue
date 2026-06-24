<script setup lang="ts">
import invoiceCode from "~/showroom-sources/invoice.ts?raw";
import zugferdCode from "~/showroom-sources/zugferd-invoice.ts?raw";
import certificateCode from "~/showroom-sources/certificate.ts?raw";
import coverCode from "~/showroom-sources/cover.ts?raw";
import datasheetCode from "~/showroom-sources/datasheet.ts?raw";
import articleCode from "~/showroom-sources/article.ts?raw";
import letterCode from "~/showroom-sources/letter.ts?raw";
import bannerCode from "~/showroom-sources/banner.ts?raw";
import labelCode from "~/showroom-sources/label.ts?raw";

useHead({ title: "Showroom - jasy" });

const cards = [
  {
    title: "Invoice",
    file: "invoice.ts",
    code: invoiceCode,
    pdf: "/showroom/invoice.pdf",
    orientation: "portrait" as const,
    description: "A two-page commercial invoice - line-item table, totals, and a footer that paginate cleanly.",
  },
  {
    title: "ZUGFeRD e-invoice",
    file: "zugferd-invoice.ts",
    code: zugferdCode,
    pdf: "/showroom/zugferd-invoice.pdf",
    orientation: "portrait" as const,
    validateHref: "/validate",
    description: "A conformant ZUGFeRD PDF/A-3 with EN-16931 XML embedded - for humans and tax offices both.",
  },
  {
    title: "Certificate",
    file: "certificate.ts",
    code: certificateCode,
    pdf: "/showroom/certificate.pdf",
    orientation: "landscape" as const,
    description: "An A4-landscape certificate - the recipient name set in an embedded TrueType script font.",
  },
  {
    title: "Cover page",
    file: "cover.ts",
    code: coverCode,
    pdf: "/showroom/cover.pdf",
    orientation: "portrait" as const,
    description: "A full-bleed cover - colour to the edge, out-of-flow positioned shapes, and overlaid display type.",
  },
  {
    title: "Datasheet",
    file: "datasheet.ts",
    code: datasheetCode,
    pdf: "/showroom/datasheet.pdf",
    orientation: "portrait" as const,
    description: "A product datasheet - stat cards, a spec table, and a bar chart drawn from primitives.",
  },
  {
    title: "Article",
    file: "article.ts",
    code: articleCode,
    pdf: "/showroom/article.pdf",
    orientation: "portrait" as const,
    description: "Flowing body copy - headings, paragraphs and inherited line-height breaking across two pages.",
  },
  {
    title: "Letter",
    file: "letter.ts",
    code: letterCode,
    pdf: "/showroom/letter.pdf",
    orientation: "portrait" as const,
    description: "A business letter - body type set once on the Document so every line inherits it; muted blocks use DefaultTextStyle.",
  },
  {
    title: "Banner",
    file: "banner.ts",
    code: bannerCode,
    pdf: "/showroom/banner.pdf",
    orientation: "landscape" as const,
    description: "An A5-landscape banner - a full-bleed image with type composited over it.",
  },
  {
    title: "Product label",
    file: "label.ts",
    code: labelCode,
    pdf: "/showroom/label.pdf",
    orientation: "portrait" as const,
    description: "A 50x65 mm label via mm() - brand, price, and a barcode drawn from rectangles.",
  },
];
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <!-- header -->
      <div class="max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          showroom <span class="text-brand-400">·</span> real code
          <span class="text-brand-400">·</span> real pdfs
        </p>

        <h1
          class="mt-5 font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          Code in.
          <span class="relative whitespace-nowrap">
            Document
            <svg
              class="absolute -bottom-1.5 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M2 7 C 60 2, 140 2, 198 6" stroke="#f3dc29" stroke-width="4" stroke-linecap="round" />
            </svg>
          </span>
          out.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          Every example is real <span class="font-medium text-brand-900 dark:text-white">@jasy/pdf</span>
          code on the left and the exact PDF it renders on the right. Scroll it, page through it,
          download it - nothing is pre-baked.
        </p>
      </div>

      <!-- cards: each hydrates (and renders its PDF) only once it scrolls into view -->
      <div class="mt-14 space-y-16">
        <LazyShowroomCard
          v-for="c in cards"
          :key="c.file"
          v-bind="c"
          hydrate-on-visible
        />
      </div>
    </div>
  </section>
</template>
