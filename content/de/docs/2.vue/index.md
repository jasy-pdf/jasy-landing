---
title: PDFs in Vue
description: PDFs als Vue-Komponenten schreiben mit @jasy/vue und direkt im Browser rendern - oder auf dem Server, mit demselben Aufruf.
navigation:
  title: PDFs in Vue
---

# PDFs in Vue

Mit `@jasy/vue` schreiben Sie ein PDF so, wie Sie eine App bauen: als Baum aus Komponenten, mit Props, Slots
und Ihren reaktiven Daten. Es ist ein schlanker Vue Custom Renderer über der Engine
[`@jasy/pdf`](/de/docs/pdf), Sie bekommen also deren echtes Layout und deren Pagination - und weil die
Engine isomorph ist, erzeugt `renderToPdf` die PDF-Bytes **direkt im Browser**. Kein Headless-Browser, kein
Umweg über den Server, kein Java.

Wenn Sie auf der React-Seite `@react-pdf/renderer` verwendet haben, wird Ihnen das vertraut vorkommen, mit
einem Unterschied: Derselbe Aufruf läuft auch komplett im Client. Sie arbeiten selbst mit React? Dieselben
Komponenten gibt es in [`@jasy/react`](/de/docs/react).

## Installation

```bash
pnpm add @jasy/vue vue
```

`vue` ist eine Peer Dependency, und `@jasy/pdf` kommt automatisch mit. Alles, was Sie brauchen - die
Komponenten und die Render-Funktion -, importieren Sie aus `@jasy/vue`.

## Die Komponenten importieren

Importieren Sie die, die Sie brauchen, aus `@jasy/vue`. In Vue bestimmen Sie selbst, was im Scope ist, ein
Name wie `Text` oder `Image` kollidiert also nie mit einer anderen Bibliothek:

```vue
<script setup lang="ts">
import { Document, Page, Text } from "@jasy/vue";
</script>
```

> Sie verwenden Nuxt? Das Modul [`@jasy/nuxt`](/de/docs/nuxt) registriert die Komponenten automatisch (ohne
> Imports) und kann ihnen ein Prefix geben, um Kollisionen zu vermeiden.

## Ihre erste PDF-Komponente

Die Wurzel einer Dokument-Komponente ist immer `<Document>`. Alles andere steckt darin, genau wie im
Element-Baum der Engine.

```vue
<!-- Invoice.vue -->
<script setup lang="ts">
import { Document, Page, Row, Box, Text, Divider } from "@jasy/vue";

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

## Als PDF rendern

`renderToPdf` nimmt die Komponente (und optional Props) und gibt das PDF als `Uint8Array` zurück. Das läuft
im Browser genauso wie in Node - dieselbe Codezeile.

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

Sie brauchen statt Bytes den rohen PDF-String? Nehmen Sie `renderToPdfString`. Auf einem Server schreiben Sie
die Bytes in eine Datei oder streamen sie als Response - es ist dasselbe `renderToPdf`.

## Wie es weitergeht

- [**Komponenten**](/de/docs/vue/components) - alle Komponenten, ihre Props und die Slots `header` / `footer` von `<Page>`.
- [**Daten und Assets**](/de/docs/vue/data-and-assets) - reaktive Daten, eigene Fonts und Bilder.
- [**PDFs erstellen**](/de/docs/pdf) - die Engine darunter, ihre Layout-Primitives und die Pagination.
