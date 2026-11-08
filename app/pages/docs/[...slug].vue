<script setup lang="ts">
definePageMeta({ i18n: { locales: ["en", "de"] } });

// Renders any /docs/* page: the translation from `docs_<locale>` when there is one, else the English page
// from `docs`, marked as not translated yet (and then not claimed as a German page - usePageLocales).
// UPage provides the three-column docs layout; Nuxt UI's prose components style the markdown.

const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();
// The content path is the same in every language: /de/docs/cli reads /docs/cli.
const path = useSwitchLocalePath()("en") || route.path;

const { data } = await useAsyncData(`docs:${locale.value}:${path}`, async () => {
  if (locale.value === "de") {
    const de = await queryCollection("docs_de").path(path).first();
    return { page: de ?? (await queryCollection("docs").path(path).first()), translated: !!de };
  }
  const de = await queryCollection("docs_de").path(path).select("path").first();
  return { page: await queryCollection("docs").path(path).first(), translated: !!de };
});
const page = computed(() => data.value?.page);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}
const untranslated = locale.value !== "en" && !data.value?.translated;
if (!data.value?.translated) usePageLocales().value[route.path] = ["en"];

const { data: nav } = await useAsyncData(`docs:nav:${locale.value}`, () =>
  loadDocsNav(locale.value, localePath),
);

// Unwrap a single "/docs" root so the sidebar lists the sections directly.
const sections = computed(() => {
  const items = nav.value ?? [];
  return items.length === 1 && items[0]?.children?.length ? items[0]!.children : items;
});

const toc = computed(() => page.value?.body?.toc?.links ?? []);

// A page title names its section ("Components - React - jasy"), so the Vue and React pages of the same
// name are not duplicate titles; the sections' own index pages carry their title alone.
const SECTIONS = ["pdf", "vue", "nuxt", "react", "invoicing", "cli"];
const parts = path.split("/").filter(Boolean);
const section = SECTIONS.includes(parts[1] ?? "") ? t(`docs.sections.${parts[1]}`) : undefined;
const fullTitle = computed(() => {
  const title = page.value?.title ?? "Docs";
  return parts.length > 2 && section ? `${title} - ${section} - jasy` : `${title} - jasy`;
});
const description = computed(() => page.value?.description);

const site = "https://jasy.dev";
const crumbs = [
  { name: "Docs", path: localePath("/docs") },
  ...(section && parts.length > 2
    ? [{ name: section, path: localePath(`/docs/${parts[1]}`) }]
    : []),
  ...(parts.length > 1 ? [{ name: page.value?.title ?? "", path: route.path }] : []),
];
useHead({
  title: fullTitle,
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: site + c.path,
        })),
      }),
    },
  ],
});
useSeoMeta({
  description,
  ogTitle: fullTitle,
  ogDescription: description,
  ogType: "article",
  twitterTitle: fullTitle,
  twitterDescription: description,
});
</script>

<template>
  <UContainer class="py-10 lg:py-14">
    <UPage>
      <template #left>
        <DocsSidebar :sections="sections" class="hidden lg:sticky lg:top-24 lg:block" />
      </template>

      <!-- mobile docs nav: a collapsible menu at the top of the content (below lg), never sticky -->
      <details class="group mb-6 rounded-lg border border-default lg:hidden">
        <summary
          class="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-default"
        >
          {{ t("docs.menu") }}
          <UIcon
            name="i-lucide-chevron-down"
            class="size-4 text-muted transition-transform group-open:rotate-180"
          />
        </summary>
        <div class="border-t border-default px-4 py-4">
          <DocsSidebar :sections="sections" />
        </div>
      </details>

      <UAlert
        v-if="untranslated"
        icon="i-lucide-languages"
        color="neutral"
        variant="subtle"
        :title="t('docs.untranslated')"
        class="mb-6"
      />
      <ContentRenderer v-if="page" :value="page" :lang="untranslated ? 'en' : undefined" />

      <template #right>
        <nav v-if="toc.length" class="hidden text-sm lg:sticky lg:top-24 lg:block">
          <p class="mb-3 font-semibold text-default">{{ t("docs.onThisPage") }}</p>
          <ul class="space-y-2 border-l border-default">
            <li v-for="link in toc" :key="link.id">
              <a
                :href="`#${link.id}`"
                class="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:text-default"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </nav>
      </template>
    </UPage>
  </UContainer>
</template>
