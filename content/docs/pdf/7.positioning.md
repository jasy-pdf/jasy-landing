---
title: Positioning
description: Overlay and crop - badges, ribbons, cut-in titles and watermarks with relative frames and Positioned children.
navigation:
  title: Positioning
---

# Positioning

Most layout flows top to bottom. Sometimes you want one thing to sit ON TOP of the flow: a badge on a
card, a ribbon, a title that cuts into a box, a watermark. `relative` frames and `Positioned` children
do exactly that. It is the CSS positioning model.

## A badge on a card

Mark a `Box` as a frame with `relative: true`. Inside it, wrap anything in `Positioned` and give it
offsets from the frame's edges. A `Positioned` child is OUT OF FLOW: it reserves no space and pushes
nothing, it just draws where you put it. A negative offset pokes it outside the frame, the "cutting in"
look.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Box, Text, Positioned, renderToBytes } from "@jasy/pdf";

const tag = (bg: string, fg: string, t: string) =>
  Box({ bg, radius: 6, padding: { x: 11, y: 6 } }, [Text(t, { size: 11, bold: true, color: fg })]);

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Box({ relative: true, bg: "#eef3fb", border: "#1450aa", radius: 12, padding: 24 }, [
        Text("Project Aurora", { size: 18, bold: true, color: "#0a2348" }),
        Text("Badges anchor to the card's corners.", { size: 12, color: "gray" }),
        Positioned({ top: -12, left: -12 }, tag("#f3dc29", "#0a2348", "NEW")), // pokes out
        Positioned({ top: 14, right: 14 }, tag("#1450aa", "#ffffff", "v2")), // inside the corner
      ]),
    ]),
  ]);

  writeFileSync("badge.pdf", await renderToBytes(doc));
}

build();
```

## Anchoring

There are two ways to place a child - use whichever reads best, even one per axis.

**Pin to an edge.** `top` / `left` / `right` / `bottom` are distances from the frame's edges. Set one
per axis; the child shrink-wraps to its content, and a negative value pokes it out.

```ts
Positioned({ top: 14, right: 14 }, badge); // inside the top-right corner
Positioned({ bottom: -10, left: -10 }, badge); // pokes out the bottom-left
```

**Anchor it.** `h` and `v` snap the child to a point - `start`, `center` or `end` on each axis - and
`x` / `y` nudge it from there. So "dead center, ten points up" is `{ h: "center", v: "center", y: -10 }`.
This is the thing edges cannot do cleanly: center.

```ts
Positioned({ h: "center", v: "center" }, watermark); // dead center of the frame
Positioned({ h: "end", v: "end", x: -8, y: -8 }, stamp); // bottom-right, inset 8
Positioned({ h: "center", v: "start", y: 12 }, ribbon); // top-center, nudged 12 down
```

An edge wins over an anchor on the same axis. With no `relative` ancestor, a `Positioned` anchors to
the page's content box.

## Cropping with overflow

A frame's `overflow` decides what happens to a child that runs past its edge: `"visible"` (the default)
lets it spill, `"hidden"` crops it at the frame, rounded corners and all. Here is the **same card**
twice, side by side, with only `overflow` changed.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Row, Box, Text, Positioned, Expanded, renderToBytes } from "@jasy/pdf";

// a blue box pinned inside the card, extending past its bottom edge
const card = (overflow: "visible" | "hidden") =>
  Box(
    {
      relative: true,
      overflow,
      bg: "#eef3fb",
      border: "#1450aa",
      radius: 10,
      height: 70,
      padding: 14,
    },
    [
      Text(`overflow: "${overflow}"`, { size: 12, bold: true, color: "#0a2348" }),
      Positioned(
        { top: 34, left: 14 },
        Box({ bg: "#1450aa", radius: 8, width: 170, height: 100, padding: 12 }, [
          Text("Pinned inside the card, it extends past the bottom edge.", {
            size: 10,
            color: "#ffffff",
          }),
        ]),
      ),
    ],
  );

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Row({ gap: 24 }, [Expanded(card("visible")), Expanded(card("hidden"))]),
    ]),
  ]);

  writeFileSync("overflow.pdf", await renderToBytes(doc));
}

build();
```

Left, the blue box hangs past the card. Right, the identical box is cropped flush at the card's edge.
`overflow: "hidden"` also crops an `Image` to a rounded box, a clean way to get a rounded or circular
photo.

## A reusable component

A component is just a function returning a tree, so "a card with a cut-in title" is a few lines you
reuse everywhere.

```ts
import { Box, Padding, Positioned, Text, type PDFElement } from "@jasy/pdf";

const TitledCard = (title: string, body: PDFElement) =>
  Box({ relative: true, overflow: "hidden", bg: "#eef3fb", radius: 10 }, [
    Padding(20, body),
    Positioned(
      { top: -10, left: -10 },
      Box({ bg: "#1450aa", radius: 6, padding: { x: 12, y: 6 } }, [
        Text(title, { color: "white", bold: true }),
      ]),
    ),
  ]);
```
