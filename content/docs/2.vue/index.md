---
title: PDFs in Vue
description: Author PDFs as Vue components with @jasy/vue and render them right in the browser - or on a server, the same call.
navigation:
  title: PDFs in Vue
---

# PDFs in Vue

`@jasy/vue` lets you author a PDF the way you build an app: a tree of components, with props, slots and
your reactive data. It is a thin Vue custom renderer over the [`@jasy/pdf`](/docs/pdf) engine, so you
get its real layout and pagination - and because the engine is isomorphic, `renderToPdf` produces the
PDF bytes **right in the browser**. No headless browser, no server round-trip, no Java.

If you have used `@react-pdf/renderer` on the React side this will feel familiar, with one difference:
the same call also runs entirely client-side.

## Install

```bash
pnpm add @jasy/vue@alpha vue
```

`vue` is a peer dependency, and `@jasy/pdf` comes along automatically. You import everything you need -
the components and the render function - from `@jasy/vue`.

## Two ways to use the components

**Import them directly** where you need them:

```vue
<script setup lang="ts">
import { Document, Page, Text } from "@jasy/vue";
</script>
```

**Or register them globally** with the plugin, so every component is available in any template without
an import:

```ts
// main.ts
import { createApp } from "vue";
import { jasyVue } from "@jasy/vue";
import App from "./App.vue";

createApp(App).use(jasyVue).mount("#app");
```

Pass a `prefix` if a name like `Text` or `Image` clashes with another UI library:

```ts
app.use(jasyVue, { prefix: "Pdf" }); // <PdfText>, <PdfRow>, ...
```

## Your first PDF component

A document component's root is always `<Document>`. Everything else nests inside, exactly like the
engine's element tree.

```vue
<!-- Invoice.vue -->
<script setup lang="ts">
import { Document, Page, Column, Row, Box, Text, Divider } from "@jasy/vue";

defineProps<{ customer: string; total: number }>();
</script>

<template>
  <Document :size="11" color="#1f2937">
    <Page :size="'A4'" :margin="48" :gap="16">
      <Text :size="24" bold color="#0a2348">Invoice #2026-001</Text>
      <Text color="#64748b">Billed to: {{ customer }}</Text>
      <Divider color="#e2e8f0" />

      <Row :justify="'between'">
        <Text>Consulting</Text>
        <Text bold>{{ total }} EUR</Text>
      </Row>

      <Box bg="#0a2348" :padding="12" :radius="6">
        <Text color="#f3dc29" bold>Total due: {{ total }} EUR</Text>
      </Box>
    </Page>
  </Document>
</template>
```

## Render it to a PDF

`renderToPdf` takes the component (and optional props) and returns the PDF as a `Uint8Array`. This runs
in the browser as happily as in Node - the same line of code.

```vue
<script setup lang="ts">
import { renderToPdf } from "@jasy/vue";
import Invoice from "./Invoice.vue";

async function download() {
  const bytes = await renderToPdf(Invoice, { customer: "ACME GmbH", total: 1190 });
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  window.open(url);
}
</script>

<template>
  <button @click="download">Download invoice</button>
</template>
```

Need the raw PDF string instead of bytes? Use `renderToPdfString`. On a server, write the bytes to a
file or stream them as a response - it is the same `renderToPdf`.

## Where to next

- [**Components**](/docs/vue/components) - the full set, their props and the `<Page>` header / footer slots.
- [**Data & assets**](/docs/vue/data-and-assets) - reactive data, custom fonts and images.
- [**Creating PDFs**](/docs/pdf) - the underlying engine, its layout primitives and pagination.
