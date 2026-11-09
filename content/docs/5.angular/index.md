---
title: PDFs in Angular
description: Create PDFs in Angular with @jasy/angular - a service, a provider and a signal-based preview, rendered right in the browser.
navigation:
  title: PDFs in Angular
---

# PDFs in Angular :since{v="beta.1"}

`@jasy/angular` connects the [`@jasy/pdf`](/docs/pdf) engine to Angular, the way Angular builds things:
`provideJasy()` in the app config, `inject(JasyPdf)` where you need a PDF, and `pdfResource()` for a
preview that follows your signals. The PDF is produced **right in the browser** - no headless browser,
no server round-trip, no Java.

You write a document as a function of its data, with the engine's own `Document`, `Page`, `Text` and
the rest. So everything in [Creating PDFs](/docs/pdf) works here as written.

## Install

```bash
ng add @jasy/angular
```

`ng add` installs `@jasy/pdf` beside it, adds `provideJasy()` to your app config, and allows jasy's
CommonJS dependencies in `angular.json`, so `ng build` does not warn about them. In an SSR app it also
allows those of jimp, which the server uses for images. Run it twice and nothing changes.

Angular 20 or newer, tested on 20, 21 and 22, zoneless and with zone.js, with and without SSR.

By hand, it is:

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

## Your first document

A document is a function: it takes your data and returns a `Document`. It runs in an injection context,
like a functional guard, so `inject()` works inside it.

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

`ng generate @jasy/angular:pdf invoice` creates such a file for you.

## Preview it and save it

`pdfResource()` renders the document and renders it again whenever its signals change. `inject(JasyPdf)`
saves it, opens it in a new tab, or hands you the bytes.

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

`latest()` is the last PDF that rendered. It stays while the next one renders, so the `<iframe>` keeps
its scroll position as you type. Why that matters, and the rest of the resource:
[Service & preview](/docs/angular/service-and-preview).

## Where to next

- [**Service & preview**](/docs/angular/service-and-preview) - `provideJasy`, fonts, `JasyPdf`,
  `pdfResource`, the server, bundle size and testing.
- [**Fill an existing PDF**](/docs/angular/forms) - read and fill a PDF form, live from an Angular form.
- [**Creating PDFs**](/docs/pdf) - the engine: layout, text, tables, pagination.

To see it all running, clone the repo and start the playground, an Angular CLI app. It renders twelve
documents and a PDF form to fill in your browser, side by side with their source.

```bash
git clone https://github.com/jasy-pdf/jasy && cd jasy && pnpm install && pnpm run build
pnpm --filter @jasy/angular play
```
