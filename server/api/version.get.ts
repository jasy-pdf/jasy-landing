// The current published @jasy/pdf version, read from the npm registry (the install source itself).
// Cached by Nitro for an hour, so the registry is hit at most once per hour across all visitors -
// never per request. Degrades to { version: null } if the registry is unreachable.
export default defineCachedEventHandler(
  async () => {
    try {
      const pkg = await $fetch<{ "dist-tags"?: Record<string, string> }>(
        "https://registry.npmjs.org/@jasy%2Fpdf",
        { timeout: 5000 },
      );
      const tags = pkg["dist-tags"] ?? {};
      return { version: tags.latest ?? tags.alpha ?? null };
    } catch {
      return { version: null };
    }
  },
  { maxAge: 60 * 60, name: "npm-version" },
);
