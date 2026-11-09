<script setup lang="ts">
// The docs version badge (rule: CLAUDE.md "Version badges"). `:since{v="beta.4"}` marks something
// new, `:since{v="beta.4" changed}` a breaking change. The version is the package the page documents;
// `pkg="pdf"` names another one - an engine feature badged on a binding's page.
const props = defineProps<{ v: string; changed?: boolean; pkg?: string }>();

const route = useRoute();
const { t } = useI18n();
const PACKAGES: Record<string, string> = {
  pdf: "@jasy/pdf",
  vue: "@jasy/vue",
  nuxt: "@jasy/nuxt",
  react: "@jasy/react",
  angular: "@jasy/angular",
  invoicing: "@jasy/e-invoice",
};
// The section follows "docs" in /docs/<section>/... and /de/docs/<section>/... alike.
const section = computed(() => {
  const parts = route.path.split("/");
  return parts[parts.indexOf("docs") + 1] ?? "";
});
const pkg = computed(() => PACKAGES[props.pkg ?? section.value] ?? "@jasy/pdf");
const label = computed(() =>
  t(`docs.badge.${props.changed ? "changed" : "since"}`, { v: props.v }),
);
const full = computed(() => {
  const version = /^\d/.test(props.v) ? props.v : `1.0.0-${props.v}`;
  return t(`docs.badge.${props.changed ? "changedFull" : "newFull"}`, { pkg: pkg.value, version });
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
