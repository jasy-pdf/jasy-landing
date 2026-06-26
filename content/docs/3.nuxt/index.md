---
title: PDFs in Nuxt
description: The @jasy/nuxt module - author PDFs as Vue components and render them in the browser or on a server route, zero config.
navigation:
  title: PDFs in Nuxt
---

# PDFs in Nuxt

`@jasy/nuxt` is the Nuxt module for [`@jasy/vue`](/docs/vue) and [`@jasy/pdf`](/docs/pdf). Add it to
`modules` and the components and render helpers are just there - no imports, no wiring. Render a PDF in
the browser with `usePdf`, or stream one from a Nitro route with `definePdfHandler`.

## Install

```bash
npx nuxi module add @jasy/nuxt
```

That installs the package and registers it for you. Or do it by hand:

```bash
pnpm add @jasy/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@jasy/nuxt"],
});
```

## Client: `usePdf`

Author a PDF as a Vue component. The jasy components are auto-registered, so there is nothing to import:

```vue
<!-- Invoice.vue -->
<template>
  <Document :size="11">
    <Page :size="'A4'" :margin="48">
      <Text :size="24" bold color="#0a2348">Invoice #{{ id }}</Text>
    </Page>
  </Document>
</template>
```

```vue
<script setup lang="ts">
import Invoice from "./Invoice.vue";

const { open, download, pending } = usePdf(Invoice, { props: { id: 42 } });
</script>

<template>
  <button :disabled="pending" @click="open">View PDF</button>
</template>
```

`open()` and `download()` render on demand and reuse the result, so one click is one render. Pass
`{ immediate: true }` to pre-render on mount.

## Server: `definePdfHandler`

The `@jasy/pdf` tree API is auto-imported in `server/`. No Vue, no browser - build the document and stream
it:

```ts
// server/api/invoice/[id].get.ts
export default definePdfHandler((event) =>
  Document([
    Page({ size: "A4", margin: 48 }, [
      Text(`Invoice #${getRouterParam(event, "id")}`, { size: 24, bold: true }),
    ]),
  ]),
);
```

`GET /api/invoice/42` streams `application/pdf`. Need auth or a data fetch first? Use
`sendPdf(event, doc, opts)` inside your own handler, or `renderToBytes(doc)` to just get the bytes - save
them, attach them to an email, anything.

### Caching

Wrap a route in Nitro's cache. The key is the request path + query, so it caches per request out of the
box:

```ts
export default definePdfHandler(build, { cache: { maxAge: 3600 } });
```

Expired entries re-render fresh (`swr` is off by default), so a stale invoice is never served.

## Options

```ts
export default defineNuxtConfig({
  modules: ["@jasy/nuxt"],
  jasy: {
    autoImport: true, // auto-register components + the tree API (default true)
    prefix: "Pdf", // <PdfDocument> in templates, PdfDocument(...) in server/ (default none)
  },
});
```

## Where to next

- [**PDFs in Vue**](/docs/vue) - the components and `renderToPdf`, in depth.
- [**Creating PDFs**](/docs/pdf) - the underlying engine and its tree API.
