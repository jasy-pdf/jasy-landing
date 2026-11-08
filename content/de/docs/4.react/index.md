---
title: PDFs in React
description: PDFs als React-Komponenten schreiben mit @jasy/react und direkt im Browser rendern - oder auf dem Server, mit demselben Aufruf.
navigation:
  title: PDFs in React
---

# PDFs in React :since{v="beta.1"}

Mit `@jasy/react` schreiben Sie ein PDF so, wie Sie eine App bauen: als Baum aus Komponenten, mit Props,
Hooks, Context und Ihren eigenen Daten. Es ist ein schlanker React-Renderer über der Engine
[`@jasy/pdf`](/de/docs/pdf), Sie bekommen also deren echtes Layout und deren Pagination - und weil die
Engine isomorph ist, erzeugt `renderToPdf` die PDF-Bytes **direkt im Browser**. Kein Headless-Browser,
kein Umweg über den Server, kein Java.

Ein Dokument in JSX rendert Byte für Byte wie dasselbe Dokument, geschrieben mit den Funktionen von
`@jasy/pdf`, und jeder Prop ist mit den eigenen Optionstypen der Engine typisiert.

## Installation

```bash
pnpm add @jasy/react @jasy/pdf react
```

React 19 (jedes 19.x). `@jasy/pdf` und `react` sind Peer Dependencies, Ihre App hat also von beidem genau
eine Kopie.

## Ihre erste PDF-Komponente

Die Wurzel eines Dokuments ist immer `<Document>`. Alles andere steckt darin, genau wie im Element-Baum der
Engine. Text sind Children, wie überall in React.

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

## Als PDF rendern

`renderToPdf` nimmt ein Element und gibt das PDF als `Uint8Array` zurück. Im Browser:

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

Auf einem Server ist es derselbe Aufruf - schreiben Sie die Bytes in eine Datei oder senden Sie sie als
Response:

```tsx
import { writeFile } from "node:fs/promises";
import { renderToPdf } from "@jasy/react";
import { Invoice } from "./Invoice";

await writeFile("invoice.pdf", await renderToPdf(<Invoice customer="ACME GmbH" total={1190} />));
```

Sie brauchen statt Bytes den rohen PDF-String? Nehmen Sie `renderToPdfString`. Eine Komponente, die wirft,
lässt das Rendern mit diesem Fehler scheitern, ein kaputtes Dokument kommt also nie halb gezeichnet heraus.

## Wie es weitergeht

- [**Komponenten**](/de/docs/react/components) - alle Komponenten, ihre Props, Header und Footer, Seitenzahlen.
- [**Daten und Assets**](/de/docs/react/data-and-assets) - Ihre Daten, eigene Fonts und Bilder, Render-Optionen.
- [**PDFs erstellen**](/de/docs/pdf) - die Engine darunter, ihre Layout-Primitives und die Pagination.

Um alles laufen zu sehen, klonen Sie das Repo und starten Sie den Playground: zwölf Dokumente, gerendert in
Ihrem Browser, neben ihrem Quellcode.

```bash
git clone https://github.com/jasy-pdf/jasy && cd jasy && pnpm install && pnpm run build
pnpm --filter @jasy/react play
```
