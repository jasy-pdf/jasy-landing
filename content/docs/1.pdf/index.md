---
title: Creating PDFs
description: Build your first PDF with @jasy/pdf in a few lines of TypeScript, then grow it into a full layout.
navigation:
  title: Creating PDFs
---

# Creating PDFs

`@jasy/pdf` lets you describe a document as a tree of components, the way you would build a user
interface, and writes the PDF byte stream itself. No headless browser, no Java. You compose a few
primitives - `Page`, `Column`, `Row`, `Box`, `Text` - and the engine lays them out.

## Install

```bash
pnpm add @jasy/pdf@alpha
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

- **Layout** - `Column`, `Row`, `Box`, `Spacer` and `Expanded` in depth.
- **Text** - sizes, weight, color, alignment and inline styling.
- **Tables**, **Images** and **Fonts**.
