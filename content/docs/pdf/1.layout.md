---
title: Layout
description: Stack, space and frame your content with Column, Row, Box, Spacer and Expanded.
navigation:
  title: Layout
---

# Layout

Every layout is built from a handful of primitives. `Column` and `Row` stack their children, `Spacer`
and `Expanded` distribute the space between them, and `Box` and `Padding` frame and inset content.

## Column and Row

`Column` stacks its children top to bottom, `Row` left to right. Both take the same options.

```ts
Column({ gap: 12 }, [Text("First"), Text("Second")]);

Row({ gap: 8, justify: "between", align: "center" }, [
  Text("Total", { size: 16, bold: true }),
  Text("100.00 EUR"),
]);
```

| Prop      | Type                                                    | What it does                                                      |
| --------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `gap`     | `number`                                                | space inserted between children, in points                        |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around"` | distribution along the stacking axis (like CSS `justify-content`) |
| `align`   | `"start" \| "center" \| "end" \| "stretch"`             | position across the axis (like CSS `align-items`)                 |

`justify: "between"` pushes the first and last child to the edges. `align: "center"` lines children up
on the cross axis. Both default to `start`.

## Spacer

`Spacer` is flexible empty space. Drop one between two items and it pushes them apart.

```ts
Row([Text("Subtotal"), Spacer(), Text("100.00 EUR")]);
```

Pass a number to weight several spacers against each other: `Spacer(2)` takes twice the space of
`Spacer(1)`.

## Expanded

`Expanded` makes a child grow to fill the remaining space. Give each one a `flex` weight to share the
space in proportion.

```ts
Row({ gap: 12 }, [
  Expanded({ flex: 1 }, Box({ border: "steelblue", padding: 12, radius: 6 }, [Text("flex 1")])),
  Expanded(
    { flex: 2 },
    Box({ bg: "#1450aa11", padding: 12, radius: 6 }, [Text("flex 2, twice as wide")]),
  ),
]);
```

| Prop   | Type     | What it does                                           |
| ------ | -------- | ------------------------------------------------------ |
| `flex` | `number` | the child's share of the remaining space (default `1`) |

`Expanded` takes a single child, not an array. In a `Row` it fills width, in a `Column` it fills height.

## Box

`Box` is the styled container: a background, a border, rounded corners, padding and an optional fixed
size. By default it fills the width it is offered (like a block element) and shrink-wraps its height to
its content. Set `width` or `height` to fix a dimension. (As a fixed child in a `Row` it shrink-wraps
its width too, since there it is not offered a width to fill.)

```ts
Box({ bg: "#1450aa11", border: "steelblue", borderWidth: 1, radius: 8, padding: 16 }, [
  Text("A framed, padded, rounded box."),
]);
```

| Prop                                                  | Type         | What it does                                        |
| ----------------------------------------------------- | ------------ | --------------------------------------------------- |
| `bg`                                                  | `ColorInput` | fill color                                          |
| `border`                                              | `ColorInput` | border color (all sides)                            |
| `borderTop` `borderRight` `borderBottom` `borderLeft` | `ColorInput` | color a single side                                 |
| `borderWidth`                                         | `number`     | border thickness (default `1` when a border is set) |
| `radius`                                              | `number`     | corner radius                                       |
| `padding`                                             | `Insets`     | inner spacing (see below)                           |
| `width` `height`                                      | `number`     | fix a dimension instead of the default sizing       |

## Padding

`Padding` insets a single child without drawing anything. It is the spacing-only cousin of `Box`.

```ts
Padding({ top: 16, bottom: 8 }, Text("Breathing room above and below."));
```

Anywhere a spacing value is taken (`padding` on a `Box`, the `Padding` element), you can write it four
ways:

```ts
16                       // all four sides
{ x: 16, y: 8 }          // horizontal / vertical
{ top: 16, left: 8 }     // per side, any subset
[16, 8, 16, 8]           // [top, right, bottom, left]
```

## Divider

`Divider` draws a thin horizontal rule across the full width of its parent - a clean separator between
sections, totals or list items.

```ts
Column({ gap: 4 }, [Text("Subtotal"), Divider(), Text("Total", { bold: true })]);
```

| Prop        | Type         | What it does                                       |
| ----------- | ------------ | -------------------------------------------------- |
| `color`     | `ColorInput` | line color (default a light gray)                  |
| `thickness` | `number`     | line thickness in points (default `1`)             |
| `margin`    | `Insets`     | space above / below the rule (default a small gap) |

```ts
Divider({ color: "#1450aa", thickness: 2, margin: { y: 12 } });
```

## Colors

Wherever a color is taken (`color`, `bg`, `border`), jasy accepts several forms. `rgb` and `rgba` are
small helpers you import from the package.

```ts
import { rgb, rgba } from "@jasy/pdf";

// every entry below is a valid color value:
const colors = [
  "steelblue", // any CSS color name
  "#1450aa", // hex
  "#1450aacc", // hex with alpha
  0xff1450aa, // ARGB number, alpha first
  rgb(20, 80, 170), // channels 0 to 255
  rgba(20, 80, 170, 0.5), // ... with an alpha of 0 to 1
];
```

## See it all in one file

Here is every primitive on this page in a single document. A `Document` can hold more than one `Page`,
so each page below demonstrates one idea. Copy it, run it once, and flip through the result.

```ts
import { writeFileSync } from "node:fs";
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Padding,
  Text,
  Spacer,
  Expanded,
  Divider,
  renderToBytes,
} from "@jasy/pdf";

const heading = (t: string) => Text(t, { size: 22, bold: true, color: "#1450aa" });
const sub = (t: string) => Text(t, { size: 12, color: "gray" });

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        heading("Column and Row"),
        sub("Column stacks top to bottom, Row stacks left to right."),
        Divider({ color: "steelblue" }),
        Row({ justify: "between", align: "center" }, [
          Text("Left", { bold: true }),
          Text("Right", { bold: true }),
        ]),
      ]),
    ]),
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        heading("Spacer"),
        sub("Flexible empty space that pushes items apart."),
        Divider({ color: "steelblue" }),
        Row([Text("Subtotal"), Spacer(), Text("100.00 EUR")]),
      ]),
    ]),
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        heading("Expanded"),
        sub("Children grow to share the remaining space by their flex weight."),
        Divider({ color: "steelblue" }),
        Row({ gap: 12 }, [
          Expanded(
            { flex: 1 },
            Box({ border: "steelblue", padding: 14, radius: 6 }, [Text("flex 1")]),
          ),
          Expanded({ flex: 2 }, Box({ bg: "#1450aa11", padding: 14, radius: 6 }, [Text("flex 2")])),
        ]),
      ]),
    ]),
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        heading("Box"),
        sub("A background, a border, rounded corners and padding."),
        Divider({ color: "steelblue" }),
        Box({ bg: "#1450aa11", border: "steelblue", borderWidth: 1, radius: 8, padding: 18 }, [
          Text("A framed, padded, rounded box."),
        ]),
      ]),
    ]),
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        heading("Padding"),
        sub("Insets a single child without drawing anything."),
        Divider({ color: "steelblue" }),
        Box({ border: "steelblue", radius: 6 }, [
          Padding(
            { x: 20, y: 14 },
            Text("This text sits inside 20pt horizontal, 14pt vertical padding."),
          ),
        ]),
      ]),
    ]),
  ]);

  writeFileSync("layout-tour.pdf", await renderToBytes(doc));
}

build();
```

Run it, open `layout-tour.pdf`, and page through Column and Row, Spacer, Expanded, Box and Padding.
