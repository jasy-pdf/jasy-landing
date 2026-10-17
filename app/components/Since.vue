<script setup lang="ts">
// The docs version badge (rule: CLAUDE.md "Version badges"). `:since{v="beta.4"}` marks something
// new, `:since{v="beta.4" changed}` a breaking change. The version is the package the page documents.
const props = defineProps<{ v: string; changed?: boolean }>();

const route = useRoute();
const PACKAGES: Record<string, string> = {
  pdf: "@jasy/pdf",
  vue: "@jasy/vue",
  nuxt: "@jasy/nuxt",
  invoicing: "@jasy/e-invoice",
};
const pkg = computed(() => PACKAGES[route.path.split("/")[2] ?? ""] ?? "@jasy/pdf");
const label = computed(() => `${props.changed ? "changed in" : "since"} ${props.v}`);
const full = computed(() => {
  const version = /^\d/.test(props.v) ? props.v : `1.0.0-${props.v}`;
  return `${props.changed ? "Changed" : "New"} in ${pkg.value} ${version}`;
});
</script>

<template>
  <UBadge
    :label="label"
    :title="full"
    :color="changed ? 'warning' : 'primary'"
    variant="subtle"
    size="sm"
    class="ml-1.5 align-middle font-medium whitespace-nowrap"
  />
</template>
