---
title: The jasy CLI
description: Read, validate and export ZUGFeRD and XRechnung invoices from your terminal. Nothing leaves your machine.
navigation:
  title: CLI
---

# The jasy CLI

`@jasy/cli` turns any ZUGFeRD or XRechnung PDF into something you can read, check and export, right from
your terminal. It runs entirely on your machine. No upload, no account.

## Install

You do not have to install anything. Run it once with `npx`:

```bash
npx @jasy/cli validate ./invoice.pdf
```

If you reach for it often, install it globally and use the `jasy` command everywhere:

```bash
pnpm add -g @jasy/cli
```

The examples below use the `jasy` command. With `npx`, write `npx @jasy/cli` instead.

## Read an invoice

`jasy read` pulls the embedded XML out of the PDF and shows you what the invoice actually says: the
parties, the line items and the totals. It understands both CII (ZUGFeRD) and UBL (PEPPOL).

```bash
jasy read invoice.pdf
```

```text
✓ invoice.pdf  ·  ZUGFeRD · EN 16931 (CII)

  invoice    INV-2026-0042
  date       2026-06-21   due 2026-07-05
  from       Northwind Studio GmbH
  to         Globex Corporation Ltd

  1  C62   Website design & build                     9600.00
  12 HUR   Strategy consulting                        1680.00
  ───────────────────────────────────────────────────────────
  net 16280.00   VAT 3009.20   total 19289.20 EUR
```

Need the raw XML? Add `--xml` to print it, or `-o invoice.xml` to save it.

```bash
jasy read invoice.pdf --xml
```

## Validate an invoice

`jasy validate` checks the invoice against the real rules: the official EN 16931 business rules, the
German XRechnung (BR-DE) rules when it is an XRechnung, and the structural PDF/A-3 requirements. It
exits non-zero when something is wrong, so it slots straight into a script or CI.

```bash
jasy validate invoice.pdf
```

```text
  invoice.pdf  ·  XRechnung (CII)
  XRechnung rules     ✓ valid
  PDF/A-3 structure   ✓ 13/13
  PDF/A (veraPDF)     n/a - `jasy verapdf --install` for the full ISO check
  → VALID
```

These are the same KoSIT Schematron rules the German authorities use, run locally against your own
file. No upload.

## The full PDF/A check

The structural checks already cover the everyday case. For the complete ISO 19005 (PDF/A) verdict, jasy
can wire up [veraPDF](https://verapdf.org), the official open-source validator. The doctor tells you
what you have and what to do next:

```bash
jasy verapdf
```

```text
  Java        ✓ 21.0.11
  veraPDF     ✗ not found
  → jasy verapdf --install
```

veraPDF is a Java application, so a Java runtime is the one requirement. Install it locally, no admin,
into `~/.jasy/verapdf`:

```bash
jasy verapdf --install
```

Once it is there, `jasy validate` adds a full `PDF/A (veraPDF)` line automatically. It is never a gate.
Your structural checks carry the everyday case on their own.

## Export the data

`jasy export` reads the invoice back into structured data and writes it as JSON, plain text or a
spreadsheet. The format follows the `-o` extension, or the `-f` flag.

```bash
jasy export invoice.pdf -f json          # JSON to stdout
jasy export invoice.pdf -o invoice.xlsx  # an Excel file
```

JSON gives you the full invoice model plus a computed totals block, ready to drop into your own system.

## The interactive terminal

Run `jasy` with no arguments to open the interactive terminal. Press `o` to open an invoice and it
shows the parties, the line items, the totals and every check in one view. From there, `j` / `t` / `x`
export to JSON, text or Excel.

```bash
jasy
```

It is the same engine as the commands above, with a UI around it.
