<script setup lang="ts">
// Links to this page in the other languages it exists in - nothing where it exists in one only, so the
// switch never leads to a missing page.
const { locale, locales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const others = computed(() =>
  locales.value
    .filter((l) => l.code !== locale.value)
    .map((l) => ({ code: l.code, name: l.name ?? l.code, to: switchLocalePath(l.code) }))
    .filter((l) => l.to),
);
</script>

<template>
  <UButton
    v-for="l in others"
    :key="l.code"
    :to="l.to"
    :hreflang="l.code"
    :lang="l.code"
    :label="l.code.toUpperCase()"
    :aria-label="`${t('lang.switch')}: ${l.name}`"
    color="neutral"
    variant="ghost"
    size="sm"
    class="font-mono text-xs font-semibold"
  />
</template>
