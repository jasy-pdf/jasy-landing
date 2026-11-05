---
title: PDFs in React
description: Author PDFs as React components with @jasy/react and render them right in the browser - or on a server, the same call.
navigation:
  title: PDFs in React
---

# PDFs in React :since{v="beta.1"}

`@jasy/react` lets you author a PDF the way you build an app: a tree of components, with props, hooks,
context and your own data. It is a thin React renderer over the [`@jasy/pdf`](/docs/pdf) engine, so you
get its real layout and pagination - and because the engine is isomorphic, `renderToPdf` produces the
PDF bytes **right in the browser**. No headless browser, no server round-trip, no Java.

A document in JSX renders byte for byte like the same document written with the `@jasy/pdf` functions,
and every prop is typed by the engine's own option types.

## Install

```bash
pnpm add @jasy/react @jasy/pdf react
```

React 19 (every 19.x). `@jasy/pdf` and `react` are peer dependencies, so your app has exactly one copy
of each.

## Your first PDF component

A document's root is always `<Document>`. Everything else nests inside, exactly like the engine's
element tree. Text is children, as anywhere in React.

```tsx
// Invoice.tsx
import { Box, Divider, Document, Page, Row, Text } from "@jasy/react";

export function Invoice({ customer, total }: { customer: string; total: number }) {
  return (
    <Document size={11} color="#1f2937">
      <Page size="A4" margin={48} gap={16}>
        <Text size={24} bold color="#0a2348">
          Invoice #2026-001
        </Text>
        <Text color="#64748b">Billed to: {customer}</Text>
        <Divider color="#e2e8f0" />

        <Row justify="between">
          <Text>Consulting</Text>
          <Text bold>{total} EUR</Text>
        </Row>

        <Box bg="#0a2348" padding={12} radius={6}>
          <Text color="#f3dc29" bold>
            Total due: {total} EUR
          </Text>
        </Box>
      </Page>
    </Document>
  );
}
```

## Render it to a PDF

`renderToPdf` takes an element and returns the PDF as a `Uint8Array`. In the browser:

```tsx
import { renderToPdf } from "@jasy/react";
import { Invoice } from "./Invoice";

export function DownloadButton() {
  async function download() {
    const bytes = await renderToPdf(<Invoice customer="ACME GmbH" total={1190} />);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    window.open(url);
  }
  return <button onClick={download}>Download invoice</button>;
}
```

On a server it is the same call - write the bytes to a file or send them as a response:

```tsx
import { writeFile } from "node:fs/promises";
import { renderToPdf } from "@jasy/react";
import { Invoice } from "./Invoice";

await writeFile("invoice.pdf", await renderToPdf(<Invoice customer="ACME GmbH" total={1190} />));
```

Need the raw PDF string instead of bytes? Use `renderToPdfString`. A component that throws fails the
render with that error, so a broken document never comes out half-drawn.

## Where to next

- [**Components**](/docs/react/components) - the full set, their props, header and footer, page numbers.
- [**Data & assets**](/docs/react/data-and-assets) - your data, custom fonts and images, render options.
- [**Creating PDFs**](/docs/pdf) - the underlying engine, its layout primitives and pagination.

To see it all running, clone the repo and start the playground: twelve documents rendered in your
browser, side by side with their source.

```bash
git clone https://github.com/jasy-pdf/jasy && cd jasy && pnpm install && pnpm run build
pnpm --filter @jasy/react play
```
