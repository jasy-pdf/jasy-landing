/**
 * The languages the page at `path` really exists in, when fewer than its route declares. A docs page
 * without a translation still renders at /de/docs/... (the English text, marked), but claims no German
 * version: app.vue drops its hreflang alternates and points the canonical at the English page.
 */
export function usePageLocales() {
  return useState<Record<string, string[]>>("page-locales", () => ({}));
}
