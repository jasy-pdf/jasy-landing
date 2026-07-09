# jasy-landing — CLAUDE.md

This repo is the **marketing landing page for JasyPDF**. The product itself lives next door in
`~/projects/jasy-pdf` (its own repo, its own `CLAUDE.md` — read that for engine internals). This file
exists so that whoever builds the landing page knows **what they are selling**.

## This repo (the landing site)

- **Nuxt 4** (`nuxt ^4.4.8`) + **Vue 3**, **Nuxt UI v4** + **Nuxt Content v3**, **pnpm**, TypeScript.
  Deploys to **jasy.dev** (Docker; CI/CD ready — see below). Branch `main`.
- **BUILT (2026-06):** hero (`HeroSection.vue`, live npm-version badge via Nitro-cached
  `server/api/version.get.ts`) · `/validate` (the validator) · `/showroom` (`ShowroomCard.vue`, 11 cards,
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

**Status: alpha — published.** `@jasy/pdf` / `@jasy/zugferd` / `@jasy/cli` are live on npm
(`1.0.0-alpha.1`, alpha dist-tag); the engine is feature-complete for the alpha. The landing is built and
being polished for launch. Runs on Node today (browser is on the roadmap). The **next big build is
`@jasy/vue`** — author PDFs as Vue components (see jasy-pdf `todo.md`). Be honest in copy — don't promise
roadmap items as shipped.

### The two pillars (decoupled — don't conflate)

1. **A declarative layout engine for documents** — Flutter-style components (`Document`, `Page`,
   `Column`, `Row`, `Box`, `Padding`, `Text`, `Paragraph`, `span`, `Image`, `Divider`, `Spacer`,
   `Expanded`, `Table`) compiling to PDF, with **real pagination** as the hard-won differentiator
   (text breaks at line boxes, bordered boxes split keeping their border, header/footer repeat, tables
   paginate at row boundaries). Closest comparison: `@react-pdf/renderer` + Yoga — beating them on
   pagination correctness + DX is the realistic bar. **Not** competing with pdf.js (reader) or
   pdf-lib/PDFKit (low-level drawers, no layout), and **not** chasing Prince/LaTeX typographic quality.

2. **Open-source ZUGFeRD / Factur-X / XRechnung (EN-16931) in pure TS/JS** — the strategic prize. The
   Node ecosystem has had no polished, dependency-light lib that renders the human-readable invoice PDF
   **and** emits conformant EN-16931 CII/UBL XML **and** validates it. Java has Mustangproject, PHP has
   horstoeko/zugferd, Python has factur-x — Node was thin. The sibling package
   **`@jasy/zugferd`** produces a conformant **ZUGFeRD / Factur-X PDF/A-3** (invoice PDF + embedded
   `factur-x.xml`) and is **validator-proven**: passes **veraPDF** (PDF/A-3B) and the EN-16931
   schema + Schematron via Mustangproject. Invoices are the _tamest_ document class, so they sidestep
   the hardest pagination edge cases.

### Headline selling points (for hero / feature copy)

- **Pure TypeScript, zero heavy runtime** — no Chromium, no JVM. Just a dependency-light npm install.
- **Flutter-style declarative API** — write a component tree, get a PDF. Sugar factories over an
  engine that stays exported for power users.
- **Real font metrics** — standard-14 AFM fonts + embeddable custom TrueType (`.ttf`, Type0/Identity-H,
  full Unicode, copy-/searchable text).
- **Real pagination** — content that overflows flows correctly to the next page.
- **E-invoicing built in** — ZUGFeRD / Factur-X / XRechnung, validator-proven PDF/A-3 + EN-16931 XML.
- **A CLI/TUI** (`@jasy/cli`, binary `jasy`) — interactive terminal to validate, read and export
  ZUGFeRD / XRechnung e-invoices.

### The Vue angle (relevant because this landing IS Vue/Nuxt)

A **framework-binding seam** already exists in the engine: `descriptor.ts` exposes a
`Descriptor {type, props, children}` + `build()` that resolves nodes through the same factories, with
`registerElement` for custom types. The roadmap calls out **authoring documents as Vue / React
components** on top of the same vocabulary. So "define your PDF as a Vue template" is a real, on-brand
future story — but it's **roadmap, not shipped**; frame it as such.

### Packages / naming (get these right in copy)

- npm scope **`@jasy`**, GitHub org **`jasy-pdf`**, author **Florian Heuberger**, **MIT**.
- `@jasy/pdf` — the core engine. `@jasy/zugferd` — e-invoicing. `@jasy/cli` — the `jasy` TUI.
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

ZUGFeRD: `const { bytes, xml } = await renderZugferd(invoice);` from `@jasy/zugferd`.

## HARD RULES (never break)

- **NEVER start or stop the dev server.** Claude does not run `pnpm dev`, does not `pkill`/kill node
  processes, does not restart anything. **Only Flo runs and controls the dev server.** Flo keeps it
  running; Claude edits files and lets HMR pick them up. If a restart or a fresh boot is needed, ASK
  Flo to do it. Starting/stopping servers caused process chaos (multiple instances, port collisions
  with the sibling `~/projects/invoice` server) — never again.
- **Only Flo commits / pushes.** Claude never commits.

## Working agreements (inherited from Flo's style on jasy-pdf)

- Comments + identifiers in **English**. Be accurate; don't over-promise unshipped features as done.
- Don't commit/push unprompted.
- When unsure what the engine actually does today, the source of truth is `~/projects/jasy-pdf`
  (`README.md`, `CLAUDE.md`, `docs/api-design.md`, `todo.md`).
