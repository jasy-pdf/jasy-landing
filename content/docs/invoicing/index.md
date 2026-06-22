---
title: E-invoices
description: Generate conformant ZUGFeRD and XRechnung e-invoices - the PDF and the EN-16931 XML - from one typed object.
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

## At a glance

You describe the invoice as one typed object; `renderZugferd` hands back both halves. You never add up
a line, a subtotal or a VAT breakdown.

```ts
const { bytes, xml } = await renderZugferd(invoice);
// bytes - a conformant ZUGFeRD PDF/A-3, with the EN-16931 XML embedded
// xml   - the same EN-16931 CII, standalone for a portal upload
```

That is the whole shape of it. For an invoice you can paste and run end to end, jump to
[A complete example](/docs/invoicing/complete-example).

## What you get

- A **PDF/A-3** with the `factur-x.xml` embedded, a Factur-X XMP packet and an sRGB output intent -
  the structure conformance checkers expect.
- The **EN-16931 CII XML**, the legally relevant part, also returned standalone for portal upload.
- **Totals by construction:** line nets, the document totals and the VAT breakdown are derived from
  your inputs, so the business-rule checks that verify the arithmetic hold automatically.

## Where to next

- [**The Invoice model**](/docs/invoicing/invoice-model) - every field you can set, parties to VAT.
- [**Profiles**](/docs/invoicing/profiles) - ZUGFeRD (EN-16931) vs XRechnung, and CII vs UBL.
- [**Validation**](/docs/invoicing/validation) - the built-in pre-flight, and validating it yourself.
- [**A complete example**](/docs/invoicing/complete-example) - the fields at a glance, a full sample, the CLI proof.
- [**The CLI**](/docs/cli) - read, validate and export any invoice from your terminal.
