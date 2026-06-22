---
title: E-invoices
description: Generate conformant ZUGFeRD and XRechnung e-invoices - the PDF and the EN-16931 XML - from one typed object.
navigation:
  title: Overview
---

# E-invoices

A ZUGFeRD or XRechnung invoice is a normal-looking PDF that **also** carries the invoice as
machine-readable XML inside it. The human reads the PDF; the buyer's system reads the embedded EN-16931
data. Germany now mandates this for B2B and B2G, and the rest of the EU is moving the same way.

`@jasy/zugferd` builds both halves from a single typed `Invoice`: a conformant PDF/A-3 with the
EN-16931 CII XML embedded, with every total and VAT line **computed for you**. No Java, no service, no
spreadsheet maths.

> The other ecosystems have Mustangproject (Java), horstoeko/zugferd (PHP) and factur-x (Python). Node
> had nothing polished. This is it.

## Install

```bash
npm install @jasy/zugferd@alpha
```

It pulls in `@jasy/pdf` itself, so that is the only package you need.

## Your first invoice

You describe the invoice; the library does the rest. You never add up a line, a subtotal or a VAT
breakdown.

```ts
import { writeFileSync } from "node:fs";
import { renderZugferd, type Invoice } from "@jasy/zugferd";

const invoice: Invoice = {
  number: "INV-001",
  issueDate: "2026-06-21",
  currency: "EUR",
  seller: {
    name: "Northwind GmbH",
    vatId: "DE265013614",
    address: { line1: "Hauptstrasse 1", city: "Berlin", postCode: "10115", country: "DE" },
  },
  buyer: {
    name: "Globex Ltd",
    address: { line1: "5 Market Square", city: "Munich", postCode: "80331", country: "DE" },
  },
  lines: [
    {
      name: "Consulting",
      quantity: 8,
      unit: "HUR",
      netUnitPrice: 120,
      vat: { category: "S", ratePercent: 19 },
    },
  ],
};

async function build() {
  const { bytes, xml } = await renderZugferd(invoice, { locale: "en" });
  writeFileSync("invoice.pdf", bytes); // a conformant ZUGFeRD PDF/A-3
  writeFileSync("invoice.xml", xml); // the standalone EN-16931 CII XML
}

build();
```

Run it with `npx tsx invoice.ts`. `invoice.pdf` opens like any PDF and carries the XML inside; the
net (960.00), the 19% VAT (182.40) and the gross total (1142.40) were all worked out by the library.

## What you get

- A **PDF/A-3** with the `factur-x.xml` embedded, a Factur-X XMP packet and an sRGB output intent -
  the structure conformance checkers expect.
- The **EN-16931 CII XML**, the legally relevant part, also returned standalone for portal upload.
- **Totals by construction:** line nets, the document totals and the VAT breakdown are derived from
  your inputs, so the business-rule checks that verify the arithmetic hold automatically.

## Where to next

- [**The Invoice model**](/docs/invoicing/invoice-model) - every field you can set, parties to VAT.
- [**Profiles**](/docs/invoicing/profiles) - ZUGFeRD (EN-16931) vs XRechnung, and CII vs UBL.
- [**Validation**](/docs/invoicing/validation) - the built-in pre-flight and external validators.
- [**The CLI**](/docs/cli) - read, validate and export any invoice from your terminal.
