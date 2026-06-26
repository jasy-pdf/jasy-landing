---
title: Pages
description: Page size, orientation and margins, repeating headers and footers, and automatic pagination.
navigation:
  title: Pages
---

# Pages

A `Document` holds one or more `Page`s. Each page sets its own size, orientation and margins, and when
its content is taller than the page, jasy flows it onto as many pages as it needs, on its own.

```ts
Page({ size: "A4", orientation: "portrait", margin: 56 }, [Text("One page.")]);
```

| Prop          | Type                                         | What it does                                   |
| ------------- | -------------------------------------------- | ---------------------------------------------- |
| `size`        | `PageSize` or a name like `"A4"`, `"letter"` | the page format (default A4)                   |
| `orientation` | `"portrait" \| "landscape"`                  | rotates the format (default portrait)          |
| `margin`      | `Insets`                                     | the content box inset (default 56pt all sides) |
| `header`      | an element                                   | drawn at the top, repeated on every page       |
| `footer`      | an element                                   | drawn at the bottom, repeated on every page    |

A `Page` also takes the [`Column` options](/docs/pdf/layout) (`gap`, `justify`, `align`), since its
children are stacked in a column.

## Many pages

Hand `Document` a list of pages. Each can differ, mixing sizes and orientations freely.

```ts
Document([
  Page({ size: "A4" }, [Text("Cover")]),
  Page({ size: "A5", orientation: "landscape" }, [Text("A landscape insert")]),
]);
```

## Headers, footers and pagination

A `header` and `footer` are laid out once and reprinted on every page the content spills onto, so a long
table or a long stack of paragraphs keeps its letterhead and page furniture throughout. You write the
content once; jasy paginates.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Column, Row, Text, renderToBytes } from "@jasy/pdf";

const header = Row({ justify: "between" }, [
  Text("Acme Inc.", { bold: true, color: "#1450aa" }),
  Text("Report"),
]);
const footer = Row({ justify: "between" }, [
  Text("Confidential", { size: 9, color: "gray" }),
  Text("2026", { size: 9, color: "gray" }),
]);

async function build() {
  const body = Array.from({ length: 60 }, (_, i) =>
    Text(`Paragraph ${i + 1} - long body text that flows across pages.`, { size: 12 }),
  );

  const doc = Document([
    Page({ size: "A4", margin: 56, header, footer }, [Column({ gap: 6 }, body)]),
  ]);

  writeFileSync("report.pdf", await renderToBytes(doc));
}

build();
```

The 60 paragraphs are taller than one page, so the result is several pages, each carrying the same
header and footer.
