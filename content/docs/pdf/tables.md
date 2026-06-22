---
title: Tables
description: Lay out rows and columns with repeating headers, flexible widths and clean rules - the heart of any invoice.
navigation:
  title: Tables
---

# Tables

A `Table` is the heart of most invoices and reports. You give it the column widths and the rows, and
it aligns every cell, repeats the header across pages, and breaks between rows so a row never gets cut
in half.

```ts
import { Table, Text } from "@jasy/pdf";

Table(
  {
    columns: ["1fr", 50, 80, 90],
    header: [
      Text("Description", { bold: true }),
      Text("Qty", { bold: true, align: "right" }),
      Text("Unit", { bold: true, align: "right" }),
      Text("Amount", { bold: true, align: "right" }),
    ],
    cellPadding: { x: 8, y: 6 },
    rule: "#c2ccdb",
  },
  [
    [
      Text("Website design & build"),
      Text("1", { align: "right" }),
      Text("9600.00", { align: "right" }),
      Text("9600.00", { align: "right" }),
    ],
    [
      Text("Strategy consulting"),
      Text("12", { align: "right" }),
      Text("140.00", { align: "right" }),
      Text("1680.00", { align: "right" }),
    ],
  ],
);
```

## Columns

`columns` has one entry per column, and decides how wide each one is. Mix the three kinds freely.

| Width            | Meaning                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `90`             | a fixed width in points                                                |
| `"1fr"`, `"2fr"` | a fraction of the leftover space, shared in proportion (like CSS `fr`) |
| `"auto"`         | as wide as the widest cell in that column, measured at layout time     |

A typical invoice uses one `"1fr"` description column that absorbs the slack, and fixed-width number
columns on the right.

## Cells and rows

`rows` is an array of rows, each an array of cells. A cell is any element, or a plain string (which is
wrapped in `Text` for you). Right-align number columns with `Text(value, { align: "right" })`.

```ts
[
  ["Apples", "Granny Smith", Text("12", { align: "right" })],
  ["Oranges", "Valencia", Text("8", { align: "right" })],
];
```

## Options

| Prop              | Type            | What it does                                                             |
| ----------------- | --------------- | ------------------------------------------------------------------------ |
| `columns`         | `ColumnWidth[]` | one width per column (required)                                          |
| `header`          | `Cell[]`        | a header row that repeats at the top of every page the table spills onto |
| `cellPadding`     | `Insets`        | padding inside every cell                                                |
| `rule`            | `ColorInput`    | a thin horizontal line under the header and along the foot               |
| `cellBorder`      | `ColorInput`    | a full grid line around every cell                                       |
| `gap`             | `number`        | space between rows and columns                                           |
| `rowGap` `colGap` | `number`        | override `gap` for one axis                                              |

## Rules or a full grid

`rule` draws two thin lines, under the header and at the foot - the clean look most invoices use.
`cellBorder` instead draws the complete grid around every cell.

```ts
// invoice style: thin separators
{ columns: ["1fr", 80], rule: "#c2ccdb", cellPadding: { x: 8, y: 6 } }

// spreadsheet style: full grid
{ columns: ["1fr", 80], cellBorder: "#c2ccdb", cellPadding: 8 }
```

Use one or the other. `cellBorder` already draws the outer edges, so do not wrap the table in a
`Box` border as well, or the edges double up.

## Across pages

A `Table` is just a `Column` of atomic rows, so it paginates for free: when a row does not fit on the
current page it moves to the next one whole, and the `header` row reprints at the top. You write the
rows once and long tables simply flow.

## See it all in one file

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Table, Text, renderToBytes } from "@jasy/pdf";

const money = (n: number) => Text(n.toFixed(2), { align: "right" });

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Table(
        {
          columns: ["1fr", 50, 80, 90],
          header: [
            Text("Description", { bold: true }),
            Text("Qty", { bold: true, align: "right" }),
            Text("Unit", { bold: true, align: "right" }),
            Text("Amount", { bold: true, align: "right" }),
          ],
          cellPadding: { x: 8, y: 6 },
          rule: "#c2ccdb",
        },
        [
          [Text("Website design & build"), Text("1", { align: "right" }), money(9600), money(9600)],
          [Text("Strategy consulting"), Text("12", { align: "right" }), money(140), money(1680)],
          [Text("Printed brand book"), Text("25", { align: "right" }), money(28), money(700)],
        ],
      ),
    ]),
  ]);

  writeFileSync("table.pdf", await renderToBytes(doc));
}

build();
```
