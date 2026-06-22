---
title: Text
description: Size, weight, color, alignment and mixed inline styling with Text, Paragraph and span.
navigation:
  title: Text
---

# Text

`Text` puts words on the page. Pass a string and a few options, and the engine wraps it to fit the
width it is given, breaking on word boundaries using the real font metrics. You never measure anything.

## When does it wrap?

A `Text` wraps to fit the width it is given - the page content width in a `Page` or `Column`, or the
width of a `Box({ width })`, an `Expanded` or a table cell when it sits inside one. With no width limit
at all (a plain child of a `Row`), it stays on a single line, because there is nothing to wrap against.

## Styling

The second argument sets the style. Everything is optional and has a sensible default.

```ts
Text("Big and bold", { size: 26, bold: true, color: "#1450aa" });
Text("A quiet note", { size: 12, italic: true, color: "gray" });
```

| Prop         | Type                            | What it does                                                      |
| ------------ | ------------------------------- | ----------------------------------------------------------------- |
| `size`       | `number`                        | font size in points (default `12`)                                |
| `bold`       | `boolean`                       | use the bold weight                                               |
| `italic`     | `boolean`                       | use the italic style                                              |
| `color`      | `ColorInput`                    | text color (any of the [color forms](/docs/pdf/layout#colors))    |
| `font`       | `string`                        | font family (default `"Helvetica"`; see [Fonts](/docs/pdf/fonts)) |
| `align`      | `"left" \| "center" \| "right"` | alignment within the text block (default `"left"`)                |
| `lineHeight` | `number`                        | line-height multiplier (default `1`)                              |
| `maxLines`   | `number`                        | cap the number of lines (default: unlimited)                      |
| `overflow`   | `"clip" \| "ellipsis"`          | what to do past `maxLines` (default `"clip"`)                     |

## Alignment

`align` positions the text inside its own block, independent of any surrounding layout.

```ts
Text("Centered", { align: "center" });
Text("Right aligned", { align: "right" });
```

## Line height

`lineHeight` is a multiplier on the line spacing. The default `1` is tight (a line box is exactly the
font size); `1.3` to `1.5` opens body copy up for comfortable reading. The extra space is split evenly
above and below each line, so the text stays centered in its box.

```ts
Text("Tight by default.");
Text("Roomier body copy, set once.", { lineHeight: 1.4 });
```

## Truncating long text

By default a `Text` wraps onto as many lines as it needs. Cap it with `maxLines`, and choose what
happens to the overflow with `overflow`: `"clip"` cuts hard, `"ellipsis"` ends the last line with
`...`. Truncation needs a bounded width - a `Column`, a `Box({ width })`, an `Expanded` or a table cell.

```ts
Box({ width: 220 }, [
  Text("Premium Wireless Noise-Cancelling Over-Ear Headphones with 40 Hour Battery Life", {
    maxLines: 2,
    overflow: "ellipsis",
  }),
]);
```

`maxLines: 1` clamps to a single line - handy for a long product name in a narrow table cell.

## Mixed styles in one line

To change style partway through a line, pass an array of `span(...)` runs instead of a string. Each
`span` overrides only the fields it sets, inheriting the rest from the `Text` options.

```ts
import { Text, span } from "@jasy/pdf";

Text(
  [
    span("This line mixes "),
    span("bold", { bold: true }),
    span(", "),
    span("italic", { italic: true }),
    span(" and "),
    span("color", { color: "#1450aa", bold: true }),
    span(" in one run."),
  ],
  { size: 14 },
);
```

`span` takes the same `TextStyle` as `Text` (`size`, `font`, `bold`, `italic`, `color`), just no
`align`, since alignment belongs to the whole block.

## Paragraphs

`Paragraph` is `Text` with a different name. It behaves identically, but reads as intent when you mean
a block of body copy rather than a label or a heading.

```ts
Paragraph(
  "Long text wraps automatically to fit its width, breaking on word boundaries using the real " +
    "font metrics, so you never have to measure anything yourself.",
  { size: 12 },
);
```

## See it all in one file

Copy this, run it with `npx tsx text-demo.ts`, and open `text.pdf`.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Column, Text, Paragraph, span, Divider, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 12 }, [
        Text("Big and bold", { size: 26, bold: true, color: "#1450aa" }),
        Text("Italic and gray", { size: 14, italic: true, color: "gray" }),
        Text("Centered", { size: 14, align: "center" }),
        Text("Right aligned", { size: 14, align: "right" }),
        Divider({ color: "steelblue" }),
        Text(
          [
            span("This line mixes "),
            span("bold", { bold: true }),
            span(", "),
            span("italic", { italic: true }),
            span(" and "),
            span("color", { color: "#1450aa", bold: true }),
            span(" in one run."),
          ],
          { size: 14 },
        ),
        Divider({ color: "steelblue" }),
        Paragraph(
          "Paragraph is Text with a name that reads as intent. Long text wraps automatically to fit " +
            "its width, breaking on word boundaries using the real font metrics, so you never measure " +
            "anything yourself.",
          { size: 12 },
        ),
      ]),
    ]),
  ]);

  writeFileSync("text.pdf", await renderToBytes(doc));
}

build();
```
