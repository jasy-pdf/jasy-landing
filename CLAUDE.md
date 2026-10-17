# jasy-landing — CLAUDE.md

This repo is the **marketing landing page for JasyPDF**. The product itself lives next door in
`~/projects/jasy-pdf` (its own repo, its own `CLAUDE.md` — read that for engine internals). This file
exists so that whoever builds the landing page knows **what they are selling**.

## This repo (the landing site)

- **Nuxt 4** (`nuxt ^4.4.8`) + **Vue 3**, **Nuxt UI v4** + **Nuxt Content v3**, **pnpm**, TypeScript.
  Deploys to **jasy.dev** (Docker; CI/CD ready — see below). Branch `main`.
- **BUILT (2026-06):** hero (`HeroSection.vue`, live npm-version badge via Nitro-cached
  `server/api/version.get.ts`) · `/validate` (the validator) · `/showroom` (`ShowroomCard.vue`, 13 cards,
  code-left / real-PDF-right via vue-pdf-embed, lazy-hydrate + render-reveal) · `/docs/*` (Content,
  mobile-ready, `DocsSidebar.vue`) · `TheHeader`/`TheFooter` (mobile menu, footer mobile-compact) ·
  a home-page `RoadmapSection`. Full **SEO + AI discoverability:** `app.vue`
  (OG/Twitter/canonical/JSON-LD/favicon), `public/{robots,llms}.txt`, `public/sitemap.xml`,
  `public/img/og.png` (made by chrome-headless from an HTML). **Package links use `npmx.dev`, not
  npmjs.com** (Daniel Roe's registry browser; install commands stay `pnpm`).
- Scripts: `pnpm dev` / `pnpm build` / `pnpm generate` / `pnpm preview`. **Make the GitHub repo public
  before launch** (links 404 while private).

## What JasyPDF is (the thing we're marketing)

> **Ja**vaScript Ea**sy** **PDF** — declarative, component-based PDF generation in **pure TypeScript**,
> inspired by Flutter's widget tree. You describe a document as a tree of components and the library
> lays it out and writes the raw PDF byte stream itself. **No headless browser, no Java, no pdf-lib
> underneath** — the low-level writer is hand-rolled, and text is laid out with real Adobe **AFM font
> metrics**, so word-wrapping/kerning are _computed_, not guessed.

**Status: alpha — published.** All five packages are live on npm (`latest` = `alpha` dist-tag):
`@jasy/pdf` · `@jasy/vue` · `@jasy/e-invoice` · `@jasy/nuxt` · `@jasy/cli`. **Do not hard-code version
numbers in copy** — the hero reads them live from the registry (`server/api/version.get.ts`), and every
number written into a file here has gone stale within weeks. The engine renders **in the browser as
well as in Node**.

**The feature set for 1.0 is COMPLETE as of 2026-09-05** — everything below is shipped and tested, and
the only item left on the beta gate is a set of published benchmarks. Nothing on this list is a
promise:

- **Text that is actually set:** kerning and Latin ligatures from the font's own GSUB (both on by
  default), justification, pluggable hyphenation + `breakWord`, right-to-left and **Arabic shaping**,
  `letterSpacing` / `wordSpacing` / `textIndent` / `textTransform`, underline and strikethrough with
  **skip-ink** (the line steps around descenders), a font **fallback stack**, orphans and widows.
- **Layout:** full flexbox (wrap, `alignContent`, `flexShrink`, `flexBasis`, `order`, reverse),
  `aspectRatio`, min/max sizes, `%` padding and margin, `alignSelf`, per-corner radius, absolute
  positioning, `overflow: hidden`, rotation.
- **Drawing:** gradients (linear + radial), **SVG** (`Image("logo.svg")` keeps a logo a vector) and
  **`Canvas`**, an imperative typed pen for charts and seals.
- **Fonts:** `.ttf`, `.woff` and **`.woff2`** are the same thing at the call site; fonts from a file,
  bytes or a URL; native colour emoji (COLR/CPAL, vectors, no CDN).
- **Documents:** real pagination with `keepTogether` / `PageBreak` / `breakBefore`, page numbers,
  links / anchors / bookmarks, **AcroForm fields** (create, read a foreign form, fill it, flatten it),
  **AES-256 encryption**, **PDF/UA tagged output**, and **byte-stable rendering**.

Be honest in copy: what jasy will NOT do it **names** rather than drawing something else — an SVG
filter, a font without the glyph, a word with no valid split point. That refusal is a selling point,
not an apology.

### The two pillars (decoupled — don't conflate)

1. **A declarative layout engine for documents** — Flutter-style components (`Document`, `Page`,
   `Column`, `Row`, `Box`, `Padding`, `Text`, `Paragraph`, `span`, `Image`, `Svg`, `Canvas`, `Divider`,
   `Spacer`, `Expanded`, `Table`, `Positioned`, `Link` / `Anchor` / `Bookmark`, `PageNumber`, and seven
   form-field kinds) compiling to PDF, with **real pagination** as the hard-won differentiator
   (text breaks at line boxes, bordered boxes split keeping their border, header/footer repeat, tables
   paginate at row boundaries). Closest comparison: `@react-pdf/renderer` + Yoga — beating them on
   pagination correctness + DX is the realistic bar. **Not** competing with pdf.js (reader) or
   pdf-lib/PDFKit (low-level drawers, no layout), and **not** chasing Prince/LaTeX typographic quality.

2. **Open-source ZUGFeRD / Factur-X / XRechnung (EN-16931) in pure TS/JS** — the strategic prize. The
   Node ecosystem has had no polished, dependency-light lib that renders the human-readable invoice PDF
   **and** emits conformant EN-16931 CII/UBL XML **and** validates it. Java has Mustangproject, PHP has
   horstoeko/zugferd, Python has factur-x — Node was thin. The sibling package
   **`@jasy/e-invoice`** produces a conformant **ZUGFeRD / Factur-X PDF/A-3** (invoice PDF + embedded
   `factur-x.xml`) and is **validator-proven**: passes **veraPDF** (PDF/A-3B) and the EN-16931
   schema + Schematron via Mustangproject. Invoices are the _tamest_ document class, so they sidestep
   the hardest pagination edge cases.

### Headline selling points (for hero / feature copy)

- **Pure TypeScript, zero heavy runtime** — no Chromium, no JVM. Just a dependency-light npm install.
- **Flutter-style declarative API** — write a component tree, get a PDF. Sugar factories over an
  engine that stays exported for power users.
- **Real font metrics** — standard-14 AFM fonts + embeddable custom fonts (`.ttf`, `.woff`, `.woff2`;
  Type0/Identity-H, full Unicode, subsetted, copy- and searchable).
- **Real pagination** — content that overflows flows correctly to the next page, and a block can refuse
  to be split.
- **Verifiable, not asserted** — every claim on this site should have a measurement behind it. See
  "Measurements we can publish" in `~/projects/jasy-pdf/todo.md`; they were all made in that repo.
- **E-invoicing built in** — ZUGFeRD / Factur-X / XRechnung, validator-proven PDF/A-3 + EN-16931 XML.
- **A CLI/TUI** (`@jasy/cli`, binary `jasy`) — interactive terminal to validate, read and export
  ZUGFeRD / XRechnung e-invoices.

### The Vue angle (relevant because this landing IS Vue/Nuxt)

**Shipped, not roadmap** — this changed in June 2026 and the old wording here said otherwise for
months. `@jasy/vue` is a Vue custom renderer whose host nodes ARE the engine's descriptor nodes, so you
author a PDF as a component tree: `<JasyDocument><JasyPage><JasyText>…`. It renders **client-side**,
in the browser, with no server on the request path. `@jasy/nuxt` is the module on top: zero config,
auto-imported components under a prefix, and `definePdfHandler` / `sendPdf` for the server side.

React has `@react-pdf/renderer`. Vue had nothing. That is the sentence.

### Packages / naming (get these right in copy)

- npm scope **`@jasy`**, GitHub org **`jasy-pdf`**, author **Florian Heuberger**, **MIT**.
- `@jasy/pdf` — the core engine. `@jasy/e-invoice` — e-invoicing. `@jasy/cli` — the `jasy` TUI.
  `@jasy/vue` — author PDFs as Vue components. `@jasy/nuxt` — the Nuxt module.
- The e-invoicing package was called `@jasy/zugferd` until 2026-07; anything still saying that is stale.
- Install surface is one import: `import { Document, Page, Text, renderToBytes } from "@jasy/pdf"`.

## Quick reference: a minimal code sample for the page

```ts
import { Document, Page, Column, Box, Text, Divider, renderToBytes } from "@jasy/pdf";

const doc = Document([
  Page({ size: "A4", margin: 56, gap: 12 }, [
    Text("JasyPDF", { size: 32, bold: true, color: "#1450aa" }),
    Text("Declarative PDFs in pure TypeScript", { size: 12, color: "gray" }),
    Divider({ color: "steelblue" }),
    Box({ border: "steelblue", bg: "#1450aa22", padding: 12, radius: 6 }, [
      Text("A note box that shrink-wraps its content and paginates cleanly."),
    ]),
  ]),
]);

const bytes: Uint8Array = await renderToBytes(doc);
```

ZUGFeRD: `const { bytes, xml } = await renderZugferd(invoice);` from `@jasy/e-invoice`.

## Version badges in the docs - HIGHEST PRIORITY, from 1.0.0-beta.4 on

Only two things get a badge: something NEW ("since beta.4", "since 1.2") and a BREAKING change ("changed
in beta.4"). What already existed gets none, even when it is documented for the first time, and neither
does a fix that leaves code written against the old behaviour working. Nothing retroactive.

- **Where:** next to the heading or the option it describes (a table row gets it in its own column or
  after the name). One badge per feature, not per paragraph.
- **How:** `:since{v="beta.4"}` (new) or `:since{v="beta.4" changed}` (breaking) - `app/components/Since.vue`,
  which takes the package from the route (`/docs/invoicing` -> `@jasy/e-invoice`). It lives in
  `components/`, NOT `components/content/` (there Nuxt names it `ContentSince` and the markdown renders a
  raw tag). Never hand-written text like "(new in ...)".
- **Maintained, not just added:**
  - a BREAKING change to a badged feature updates the badge ("changed in 1.3") and the text with it;
  - a feature superseded by another: badge and text say so and point to the replacement;
  - at a major (2.0): a deprecated feature is removed from the docs; a badge that only says "since 1.x" is
    dropped, because by then it is simply the standard.
- Every docs change for a release checks the badges it touches. Stale badges are a bug.

## HARD RULES (never break)

- **The dev server is Flo's, on port 3001.** Since 2026-10-17 Claude MAY restart it when a change
  needs one (Flo: "du darfst stoppen und neu starten"). The Nuxt 4.6 CLI refuses an agent start and
  names the flag that takes the running server over - use exactly that flag, so it REPLACES the one on
  3001 instead of starting a second instance. Never `pkill`/kill node processes by pattern (the sibling
  `~/projects/invoice` server and Flo's other servers match too), never leave a second instance running.
- **Only Flo commits / pushes.** Claude never commits.

## Working agreements (inherited from Flo's style on jasy-pdf)

- Comments + identifiers in **English**. Be accurate; don't over-promise unshipped features as done.
- Don't commit/push unprompted.
- When unsure what the engine actually does today, the source of truth is `~/projects/jasy-pdf`
  (`README.md`, `CLAUDE.md`, `docs/api-design.md`, `todo.md`).
