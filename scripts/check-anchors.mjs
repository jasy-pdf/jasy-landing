// Every link to `/<path>#<id>` in the generated site must hit an id on that page. A translated page has
// its own anchors (German headings slug in German), so a link written for the English page breaks
// silently - the browser just lands at the top. Run after `nuxi generate`:
//
//   node scripts/check-anchors.mjs   exit 1 on a broken anchor
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const pub = new URL("../.output/public", import.meta.url).pathname;
if (!existsSync(pub)) {
  console.error("check-anchors: no .output/public - run `nuxi generate` first.");
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const ids = new Map();
function idsOf(path) {
  if (!ids.has(path)) {
    const file = join(pub, path, "index.html");
    ids.set(
      path,
      existsSync(file)
        ? new Set([...readFileSync(file, "utf8").matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
        : null,
    );
  }
  return ids.get(path);
}

const broken = new Set();
for (const file of walk(pub).filter((f) => f.endsWith(".html"))) {
  for (const [, path, id] of readFileSync(file, "utf8").matchAll(/href="(\/[^"#?]*)#([^"]+)"/g)) {
    if (!idsOf(path)?.has(decodeURIComponent(id)))
      broken.add(`${relative(pub, file)} -> ${path}#${id}`);
  }
}
for (const b of broken) console.error(`broken anchor: ${b}`);
if (broken.size) process.exit(1);
console.log("check-anchors: all anchors resolve.");
