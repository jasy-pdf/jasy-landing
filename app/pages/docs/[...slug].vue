<script setup lang="ts">
// Renders any /docs/* page from the `docs` collection. UPage provides the three-column docs layout;
// the markdown is styled by Nuxt UI's prose components automatically (code blocks, headings, tables).
const route = useRoute();

const { data: page } = await useAsyncData(`docs:${route.path}`, () =>
  queryCollection("docs").path(route.path).first(),
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const { data: nav } = await useAsyncData("docs:nav", () => queryCollectionNavigation("docs"));

// Unwrap a single "/docs" root so the sidebar lists the sections directly.
const sections = computed(() => {
  const items = nav.value ?? [];
  return items.length === 1 && items[0]?.children?.length ? items[0]!.children : items;
});

const toc = computed(() => page.value?.body?.toc?.links ?? []);

// A page title names its section ("Components - React - jasy"), so the Vue and React pages of the same
// name are not duplicate titles; the sections' own index pages carry their title alone.
const SECTIONS: Record<string, string> = {
  pdf: "PDF engine",
  vue: "Vue",
  nuxt: "Nuxt",
  react: "React",
  invoicing: "E-invoicing",
  cli: "CLI",
};
const parts = route.path.split("/").filter(Boolean);
const section = SECTIONS[parts[1] ?? ""];
const fullTitle = computed(() => {
  const title = page.value?.title ?? "Docs";
  return parts.length > 2 && section ? `${title} - ${section} - jasy` : `${title} - jasy`;
});
const description = computed(() => page.value?.description);

const site = "https://jasy.dev";
const crumbs = [
  { name: "Docs", path: "/docs" },
  ...(section && parts.length > 2 ? [{ name: section, path: `/docs/${parts[1]}` }] : []),
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
          Documentation
          <UIcon
            name="i-lucide-chevron-down"
            class="size-4 text-muted transition-transform group-open:rotate-180"
          />
        </summary>
        <div class="border-t border-default px-4 py-4">
          <DocsSidebar :sections="sections" />
        </div>
      </details>

      <ContentRenderer v-if="page" :value="page" />

      <template #right>
        <nav v-if="toc.length" class="hidden text-sm lg:sticky lg:top-24 lg:block">
          <p class="mb-3 font-semibold text-default">On this page</p>
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
