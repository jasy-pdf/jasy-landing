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
// cannot be forgotten. Its languages and their paths come from the page's own definePageMeta - the same
// declaration the router uses - and every page must make one, or it would get a copy in every language.
const LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "en";
const PAGES = {
  "index.vue": { route: "/", priority: "1.0", changefreq: "weekly", also: ["app/components"] },
  "showroom.vue": { route: "/showroom", priority: "0.9", changefreq: "weekly" },
  "validate.vue": { route: "/validate", priority: "0.9", changefreq: "monthly" },
  "e-rechnung.vue": { route: "/e-rechnung", priority: "0.9", changefreq: "monthly" },
  "benchmark.vue": { route: "/benchmark", priority: "0.8", changefreq: "monthly" },
  "imprint.vue": { route: "/imprint", priority: "0.2" },
  "privacy.vue": { route: "/privacy", priority: "0.2" },
};
const pagesDir = join(root, "app/pages");
const allPageFiles = walk(pagesDir)
  .map((f) => relative(pagesDir, f))
  .filter((f) => f.endsWith(".vue"));
const pageFiles = allPageFiles.filter((f) => !f.startsWith("docs/"));
const unlisted = pageFiles.filter((f) => !PAGES[f]);
if (unlisted.length) {
  console.error(
    `seo.mjs: pages missing from PAGES (add them with a priority): ${unlisted.join(", ")}`,
  );
  process.exit(1);
}

/** The languages a page declares, and the path it has in each: `{ en: "/validate", de: "/de/..." }`. */
function localizedPaths(file, route) {
  const source = readFileSync(join(pagesDir, file), "utf8");
  const meta = /i18n:\s*\{\s*locales:\s*\[([^\]]*)\](?:,\s*paths:\s*\{([^}]*)\})?/.exec(source);
  if (!meta) {
    console.error(
      `seo.mjs: ${file} declares no languages - add definePageMeta({ i18n: { locales } }).`,
    );
    process.exit(1);
  }
  const locales = [...meta[1].matchAll(/"(\w+)"/g)].map((m) => m[1]);
  const custom = Object.fromEntries(
    [...(meta[2] ?? "").matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );
  const unknown = locales.filter((l) => !LOCALES.includes(l));
  if (unknown.length) {
    console.error(`seo.mjs: ${file} names unknown languages: ${unknown.join(", ")}`);
    process.exit(1);
  }
  return Object.fromEntries(
    locales.map((l) => {
      const path = custom[l] ?? route;
      return [l, l === DEFAULT_LOCALE ? path : `/${l}${path === "/" ? "" : path}`];
    }),
  );
}
// The docs page declares its languages too; the docs themselves are listed below, one URL each.
localizedPaths("docs/[...slug].vue", "/docs");

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
  ...Object.entries(PAGES).flatMap(([file, page]) => {
    const paths = localizedPaths(file, page.route);
    const alternates = Object.keys(paths).length > 1 ? paths : undefined;
    const date = lastmod(join("app/pages", file), "i18n/locales", ...(page.also ?? []));
    return Object.values(paths).map((path) => ({ ...page, path, alternates, lastmod: date }));
  }),
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
