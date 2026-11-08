---
title: PDFs in Nuxt
description: Das Modul @jasy/nuxt - PDFs als Vue-Komponenten schreiben und im Browser oder in einer Server-Route rendern, ohne Konfiguration.
navigation:
  title: PDFs in Nuxt
---

# PDFs in Nuxt

`@jasy/nuxt` ist das Nuxt-Modul für [`@jasy/vue`](/de/docs/vue) und [`@jasy/pdf`](/de/docs/pdf). Tragen Sie
es in `modules` ein, und die Komponenten und Render-Helfer sind einfach da - keine Imports, keine
Verdrahtung. Rendern Sie ein PDF im Browser mit `usePdf`, oder streamen Sie eines aus einer Nitro-Route mit
`definePdfHandler`.

## Installation

```bash
npx nuxi module add @jasy/nuxt
```

Das installiert das Paket und registriert es für Sie. Oder von Hand:

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

Schreiben Sie ein PDF als Vue-Komponente. Die jasy-Komponenten werden automatisch registriert, es gibt also
nichts zu importieren:

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

`open()` und `download()` rendern bei Bedarf und verwenden das Ergebnis wieder, ein Klick ist also ein
Rendervorgang. Mit `{ immediate: true }` wird schon beim Mount gerendert.

## Server: `definePdfHandler`

Die Tree-API von `@jasy/pdf` wird in `server/` automatisch importiert. Kein Vue, kein Browser - bauen Sie
das Dokument und streamen Sie es:

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

`GET /api/invoice/42` streamt `application/pdf`. Sie brauchen vorher Auth oder einen Daten-Fetch? Nehmen Sie
`sendPdf(event, doc, opts)` in Ihrem eigenen Handler, oder `renderToBytes(doc)`, um nur die Bytes zu
bekommen - speichern, an eine E-Mail hängen, was auch immer.

### Caching

Umschließen Sie eine Route mit dem Cache von Nitro. Der Key ist Pfad + Query des Requests, es wird also von
Haus aus pro Request gecacht:

```ts
export default definePdfHandler(build, { cache: { maxAge: 3600 } });
```

Abgelaufene Einträge werden frisch gerendert (`swr` ist standardmäßig aus), eine veraltete Rechnung wird
also nie ausgeliefert.

## Optionen

```ts
export default defineNuxtConfig({
  modules: ["@jasy/nuxt"],
  jasy: {
    autoImport: true, // auto-register components + the tree API (default true)
    prefix: "Pdf", // <PdfDocument> in templates, PdfDocument(...) in server/ (default none)
  },
});
```

### Ein Prefix verwenden

Der Standard ist keiner, und das ist die riskante Einstellung: Auto-Imports ohne Prefix heißen wirklich
`Text`, `Row`, `Box` und `Image` - und Nuxt UI, die meisten Komponenten-Bibliotheken und sogar das DOM
belegen einige davon schon. `prefix: "Jasy"` oder `"Pdf"` kostet Sie fünf Zeichen pro Tag und beseitigt
eine ganze Klasse verwirrender Kollisionen. Es gilt für beide Seiten, die Factories auf dem Server passen
also zu den Komponenten.

## Wie es weitergeht

- [**PDFs in Vue**](/de/docs/vue) - die Komponenten und `renderToPdf`, ausführlich. Alles dort gibt es
  auch hier, `<Svg>` und `<Canvas>` eingeschlossen - das Modul registriert nur dieselben Komponenten unter
  Ihrem Prefix.
- [**PDFs erstellen**](/de/docs/pdf) - die Engine darunter und ihre Tree-API.
