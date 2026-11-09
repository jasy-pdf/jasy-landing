---
title: PDFs in Angular
description: PDFs in Angular erzeugen mit @jasy/angular - ein Service, ein Provider und eine Vorschau auf Signals, direkt im Browser gerendert.
navigation:
  title: PDFs in Angular
---

# PDFs in Angular :since{v="beta.1"}

`@jasy/angular` verbindet die Engine [`@jasy/pdf`](/de/docs/pdf) mit Angular, so wie Angular Dinge baut:
`provideJasy()` in der App-Config, `inject(JasyPdf)` dort, wo Sie ein PDF brauchen, und `pdfResource()`
für eine Vorschau, die Ihren Signals folgt. Das PDF entsteht **direkt im Browser** - kein
Headless-Browser, kein Umweg über den Server, kein Java.

Ein Dokument schreiben Sie als Funktion seiner Daten, mit `Document`, `Page`, `Text` und den übrigen
Funktionen der Engine. Alles aus [PDFs erstellen](/de/docs/pdf) funktioniert hier also genau so.

## Installation

```bash
ng add @jasy/angular
```

`ng add` installiert `@jasy/pdf` daneben, trägt `provideJasy()` in Ihre App-Config ein und erlaubt die
CommonJS-Abhängigkeiten von jasy in der `angular.json`, damit `ng build` nicht davor warnt. In einer
SSR-App erlaubt es auch die von jimp, das der Server für Bilder nutzt. Ein zweiter Aufruf ändert nichts.

Angular 20 oder neuer, getestet mit 20, 21 und 22, zoneless und mit zone.js, mit und ohne SSR.

Von Hand sieht das so aus:

```bash
pnpm add @jasy/angular @jasy/pdf
```

```json
"build": {
  "options": {
    "allowedCommonJsDependencies": ["svgpath", "brotli", "base64-js"]
  }
}
```

## Ihr erstes Dokument

Ein Dokument ist eine Funktion: Sie nimmt Ihre Daten und gibt ein `Document` zurück. Sie läuft in einem
Injection Context, wie ein funktionaler Guard, `inject()` funktioniert darin also.

```ts
// invoice.pdf.ts
import { formatCurrency } from "@angular/common";
import { LOCALE_ID, inject } from "@angular/core";
import type { PdfDocumentFn } from "@jasy/angular";
import { Document, Page, Row, Table, Text } from "@jasy/pdf";

export interface Invoice {
  number: string;
  items: { desc: string; amount: number }[];
}

export const invoicePdf: PdfDocumentFn<Invoice> = (invoice) => {
  const locale = inject(LOCALE_ID);
  const eur = (n: number) => formatCurrency(n, locale, "€", "EUR");

  return Document({ size: 11 }, [
    Page({ size: "A4", gap: 16 }, [
      Row({ justify: "between" }, [
        Text("Acme GmbH", { size: 22, bold: true, color: "#0a2348" }),
        Text(`INVOICE ${invoice.number}`, { size: 22, bold: true, color: "#1450aa" }),
      ]),
      Table(
        {
          columns: ["1fr", 120],
          cellBorder: "#e2e8f0",
          cellPadding: 8,
          header: ["Description", "Amount"],
        },
        invoice.items.map((item) => [item.desc, Text(eur(item.amount), { align: "right" })]),
      ),
    ]),
  ]);
};
```

`ng generate @jasy/angular:pdf invoice` legt Ihnen eine solche Datei an.

## Vorschau und Speichern

`pdfResource()` rendert das Dokument und rendert es neu, sobald sich seine Signals ändern.
`inject(JasyPdf)` speichert es, öffnet es in einem neuen Tab oder gibt Ihnen die Bytes.

```ts
// invoice-preview.ts
import { Component, inject, input } from "@angular/core";
import { JasyPdf, pdfResource } from "@jasy/angular";
import { invoicePdf, type Invoice } from "./invoice.pdf";

@Component({
  selector: "app-invoice-preview",
  template: `
    @if (preview.latest(); as pdf) {
      <iframe [src]="pdf.safeUrl" title="Invoice"></iframe>
    }
    <button (click)="download()">Download</button>
  `,
})
export class InvoicePreview {
  private readonly pdf = inject(JasyPdf);
  readonly invoice = input.required<Invoice>();

  // Renders again whenever the invoice changes.
  readonly preview = pdfResource(invoicePdf, () => this.invoice());

  download() {
    return this.pdf.download(invoicePdf, this.invoice(), `invoice-${this.invoice().number}.pdf`);
  }
}
```

`latest()` ist das letzte PDF, das fertig gerendert wurde. Es bleibt stehen, während das nächste rendert,
der `<iframe>` behält beim Tippen also seine Scroll-Position. Warum das zählt, und den Rest der Resource:
[Service & Vorschau](/de/docs/angular/service-and-preview).

## Wie es weitergeht

- [**Service & Vorschau**](/de/docs/angular/service-and-preview) - `provideJasy`, Schriften, `JasyPdf`,
  `pdfResource`, der Server, die Bundle-Größe und Tests.
- [**Ein bestehendes PDF ausfüllen**](/de/docs/angular/forms) - ein PDF-Formular lesen und füllen, live aus
  einem Angular-Formular.
- [**PDFs erstellen**](/de/docs/pdf) - die Engine: Layout, Text, Tabellen, Pagination.

Um alles laufen zu sehen, klonen Sie das Repo und starten den Playground, eine Angular-CLI-App. Er rendert
zwölf Dokumente und ein PDF-Formular zum Ausfüllen in Ihrem Browser, neben ihrem Quelltext.

```bash
git clone https://github.com/jasy-pdf/jasy && cd jasy && pnpm install && pnpm run build
pnpm --filter @jasy/angular play
```
