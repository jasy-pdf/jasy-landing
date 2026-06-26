import { createHighlighter, type Highlighter } from "shiki";

// One shared highlighter (loading the theme + grammar is the expensive part, so do it once). The code
// panels are painted brand-navy by CSS; we keep the theme's token colours but drop its background.
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["typescript"],
  }).catch((err) => {
    // Don't cache a failed init — clear it so the next call retries instead of replaying the error.
    highlighterPromise = null;
    throw err;
  });
  return highlighterPromise;
}

export async function highlightTs(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: "typescript",
    theme: "github-dark-default",
  });
}
