---
title: Create PDFs in TypeScript and Node.js
description: Build your first PDF with @jasy/pdf in a few lines of TypeScript - in Node or the browser - then grow it into a full, paginated layout. No headless browser.
navigation:
  title: Creating PDFs
---

# Creating PDFs

`@jasy/pdf` lets you describe a document as a tree of components, the way you would build a user
interface, and writes the PDF byte stream itself. No headless browser, no Java. You compose a few
primitives - `Page`, `Column`, `Row`, `Box`, `Text` - and the engine lays them out.

## Install

```bash
pnpm add @jasy/pdf
```

To run a TypeScript file directly and get full type support, add [`tsx`](https://tsx.is) and the Node
type definitions as dev dependencies:

```bash
pnpm add -D tsx @types/node
```

## Your first PDF

Create a file, paste this in, and you have a one-page PDF. It works in any project, whether your
`package.json` uses `commonjs` or `module`.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Text, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Text("Hello from jasy", { size: 28, bold: true, color: "#1450aa" }),
      Text("Declarative PDFs in pure TypeScript.", { size: 13, color: "gray" }),
    ]),
  ]);

  writeFileSync("hello.pdf", await renderToBytes(doc));
}

build();
```

Run it with [`tsx`](https://tsx.is) (or your own build step):

```bash
npx tsx hello.ts
```

Open `hello.pdf` and there it is. The shape never changes: a `Document` holds `Page`s, a `Page` holds
your content, and `renderToBytes` gives you a `Uint8Array` you can write to a file or stream to a
browser. Prefer a string? Use `renderPdf` instead.

## A real document

Layouts come from a handful of primitives. `Column` stacks its children with a `gap`, `Divider` draws
a line, and `Box` wraps content with a background, padding and rounded corners.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Column, Box, Text, Divider, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 12 }, [
        Text("Project Report", { size: 30, bold: true, color: "#1450aa" }),
        Text("A second look at the layout primitives.", { size: 13, color: "gray" }),
        Divider({ color: "steelblue" }),
        Box({ bg: "#1450aa11", padding: 16, radius: 8 }, [
          Text("A box with a soft background, padding and rounded corners."),
        ]),
      ]),
    ]),
  ]);

  writeFileSync("report.pdf", await renderToBytes(doc));
}

build();
```

That is the whole idea. Everything else is more of the same: more primitives, more props.

## Where to next

- [**Layout**](/docs/pdf/layout) - `Column`, `Row`, `Box`, flexbox wrapping, sizing and gradients.
- [**Text**](/docs/pdf/text) - weight and color, kerning and ligatures, hyphenation, right-to-left.
- [**Pages**](/docs/pdf/pages) - headers, footers, page breaks, orphans and widows, `Page X of Y`.
- [**Columns**](/docs/pdf/columns) - newspaper columns, and layouts of your own that the text flows through.
- [**SVG and Canvas**](/docs/pdf/drawing) - a logo that stays a vector, and a pen for everything else.
- [**Forms**](/docs/pdf/forms) - fillable fields, and filling a form somebody else made.
- [**Navigation**](/docs/pdf/navigation) - links to the web, jumps inside the document, and a bookmark tree.
- [**Tables**](/docs/pdf/tables), [**Images**](/docs/pdf/images), [**Fonts**](/docs/pdf/fonts),
  [**Encryption**](/docs/pdf/encryption) and [**Accessibility**](/docs/pdf/accessibility).
