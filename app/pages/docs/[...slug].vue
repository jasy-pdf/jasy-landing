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

useHead({ title: () => `${page.value?.title ?? "Docs"} — jasy` });
useSeoMeta({ description: () => page.value?.description });
</script>

<template>
  <UContainer class="py-10 lg:py-14">
    <UPage>
      <template #left>
        <nav class="sticky top-24 space-y-5 text-sm">
          <div v-for="section in sections" :key="section.path">
            <NuxtLink :to="section.path" class="block font-semibold text-default">
              {{ section.title }}
            </NuxtLink>
            <ul v-if="section.children?.length" class="mt-2 space-y-1 border-l border-default">
              <li v-for="child in section.children" :key="child.path">
                <NuxtLink
                  :to="child.path"
                  class="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition-colors hover:text-default"
                  active-class="!border-primary font-medium !text-primary"
                >
                  {{ child.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </template>

      <ContentRenderer v-if="page" :value="page" />

      <template #right>
        <nav v-if="toc.length" class="sticky top-24 text-sm">
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
