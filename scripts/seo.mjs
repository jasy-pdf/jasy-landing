// Writes public/sitemap.xml and public/llms-full.txt from the pages and the docs that exist, so neither
// can go stale again (the sitemap missed every Vue, Nuxt and React page once). `lastmod` is the date of
// the last commit that touched the source, so it needs the git history: run it in the repo, commit the
// result. `release.sh` refuses to release while the committed files are out of date.
//
//   node scripts/seo.mjs          write both files
//   node scripts/seo.mjs --check  exit 1 if either file would change
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = "https://jasy.dev";
const root = new URL("..", import.meta.url).pathname;
const check = process.argv.includes("--check");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** The date of the last commit that touched any of `paths`, as YYYY-MM-DD. */
function lastmod(...paths) {
  const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...paths], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  return out || new Date().toISOString().slice(0, 10);
}

// --- The pages outside the docs. Every page file must be listed here; a new one fails the script, so it
// cannot be forgotten. `alternates` pairs a page with its other-language twin (hreflang).
const PAGES = {
  "index.vue": { path: "/", priority: "1.0", changefreq: "weekly", also: ["app/components"] },
  "showroom.vue": { path: "/showroom", priority: "0.9", changefreq: "weekly" },
  "validate.vue": {
    path: "/validate",
    priority: "0.9",
    changefreq: "monthly",
    alternates: { en: "/validate", de: "/de/e-rechnung-pruefen" },
  },
  "de/e-rechnung.vue": { path: "/de/e-rechnung", priority: "0.9", changefreq: "monthly" },
  "de/e-rechnung-pruefen.vue": {
    path: "/de/e-rechnung-pruefen",
    priority: "0.9",
    changefreq: "monthly",
    alternates: { en: "/validate", de: "/de/e-rechnung-pruefen" },
  },
  "benchmark.vue": { path: "/benchmark", priority: "0.8", changefreq: "monthly" },
  "imprint.vue": { path: "/imprint", priority: "0.2" },
  "privacy.vue": { path: "/privacy", priority: "0.2" },
};
const pagesDir = join(root, "app/pages");
const pageFiles = walk(pagesDir)
  .map((f) => relative(pagesDir, f))
  .filter((f) => f.endsWith(".vue") && !f.startsWith("docs/"));
const unlisted = pageFiles.filter((f) => !PAGES[f]);
if (unlisted.length) {
  console.error(
    `seo.mjs: pages missing from PAGES (add them with a priority): ${unlisted.join(", ")}`,
  );
  process.exit(1);
}

// --- The docs: content/docs/<n>.<section>/<n>.<page>.md -> /docs/<section>/<page>.
const docsDir = join(root, "content/docs");
const order = (p) => p.split("/").map((part) => Number.parseInt(part, 10) || 0);
const docs = walk(docsDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const rel = relative(docsDir, file);
    const parts = rel
      .replace(/\.md$/, "")
      .split("/")
      .map((p) => p.replace(/^\d+\./, ""));
    if (parts.at(-1) === "index") parts.pop();
    const source = readFileSync(file, "utf8");
    const front = /^---\n([\s\S]*?)\n---\n/.exec(source);
    const field = (name) =>
      new RegExp(`^${name}:\\s*(.+)$`, "m").exec(front?.[1] ?? "")?.[1]?.trim();
    return {
      file,
      rel,
      path: "/docs" + (parts.length ? `/${parts.join("/")}` : ""),
      title: field("title") ?? parts.at(-1),
      description: field("description"),
      body: front ? source.slice(front[0].length) : source,
    };
  })
  .sort((a, b) => {
    const [x, y] = [order(a.rel), order(b.rel)];
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
    }
    return 0;
  });

// --- sitemap.xml
const url = ({ path, priority, changefreq, lastmod: date, alternates }) =>
  [
    "  <url>",
    `    <loc>${SITE}${path}</loc>`,
    `    <lastmod>${date}</lastmod>`,
    ...(changefreq ? [`    <changefreq>${changefreq}</changefreq>`] : []),
    `    <priority>${priority}</priority>`,
    ...Object.entries(alternates ?? {}).map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${href}"/>`,
    ),
    "  </url>",
  ].join("\n");

const entries = [
  ...Object.entries(PAGES).map(([file, page]) => ({
    ...page,
    lastmod: lastmod(join("app/pages", file), ...(page.also ?? [])),
  })),
  ...docs.map((d) => ({
    path: d.path,
    priority: d.path.split("/").length <= 3 ? "0.8" : "0.7",
    changefreq: d.path.split("/").length <= 3 ? "weekly" : undefined,
    lastmod: lastmod(relative(root, d.file)),
  })),
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries.map(url),
  "</urlset>",
  "",
].join("\n");

// --- llms-full.txt: the whole documentation as one plain file for language models.
const plain = (md) =>
  md
    .replace(/:since\{v="([^"]+)"[^}]*\bchanged\b[^}]*\}/g, "(changed in $1)")
    .replace(/:since\{v="([^"]+)"[^}]*\}/g, "(since $1)")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
const llmsFull = [
  "# jasy - full documentation",
  "",
  "> Declarative PDFs and conformant XRechnung / ZUGFeRD / Factur-X e-invoices in pure TypeScript, in Node",
  "> or the browser, as functions, Vue components or React components. Every page of https://jasy.dev/docs",
  "> below, in order. The short index is https://jasy.dev/llms.txt.",
  "",
  ...docs.map((d) =>
    [
      "---",
      "",
      `Source: ${SITE}${d.path}`,
      ...(d.description ? [`Summary: ${d.description}`] : []),
      "",
      plain(d.body),
      "",
    ].join("\n"),
  ),
].join("\n");

const outputs = [
  ["public/sitemap.xml", sitemap],
  ["public/llms-full.txt", llmsFull],
];
let stale = false;
for (const [file, content] of outputs) {
  const path = join(root, file);
  let current = "";
  try {
    current = readFileSync(path, "utf8");
  } catch {}
  if (current === content) continue;
  stale = true;
  if (!check) writeFileSync(path, content);
  console.log(`${check ? "out of date" : "wrote"}: ${file}`);
}
if (check && stale) {
  console.error("seo.mjs: run `pnpm seo` and commit the result.");
  process.exit(1);
}
