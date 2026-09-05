/**
 * The published @jasy/pdf release, and the STAGE derived from it.
 *
 * The stage used to be typed into the header ("alpha") and into the hero ("pre-release"), which meant
 * the day we ship a beta the site would still say alpha until someone remembered. The version already
 * arrives from the registry, and a semver pre-release tag names the stage - so read it there.
 *
 *   1.0.0-alpha.12  ->  "alpha"
 *   1.0.0-beta.1    ->  "beta"
 *   1.0.0-rc.2      ->  "rc"
 *   1.0.0           ->  null, and nothing is shown at all
 */
export function useRelease() {
  const { data } = useFetch<{ version: string | null }>("/api/version", {
    lazy: true,
    key: "npm-release",
  });

  const version = computed(() => data.value?.version ?? null);

  const stage = computed<string | null>(() => {
    const v = version.value;
    if (!v) return null;
    // Everything after the first "-" is the pre-release tag; its first dot-separated part is the name.
    const tag = v.includes("-") ? v.slice(v.indexOf("-") + 1) : "";
    const name = tag.split(".")[0]?.toLowerCase() ?? "";
    return name || null;
  });

  /** True while the package is still a pre-release - the hero uses it for its wording. */
  const prerelease = computed(() => stage.value !== null);

  return { version, stage, prerelease };
}
