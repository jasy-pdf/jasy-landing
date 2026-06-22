---
title: Fonts
description: The 14 standard fonts out of the box, plus embed any TrueType font for full Unicode and your own brand type.
navigation:
  title: Fonts
---

# Fonts

Out of the box you have the 14 standard PDF fonts, no setup required. Bring your own TrueType font when
you need brand type or characters beyond Latin, and jasy embeds it, subsets it and compresses it for
you.

## The standard fonts

Three families ship with every PDF reader, so jasy embeds nothing for them. Pick one with `font`; the
default is Helvetica. `bold` and `italic` select the matching face.

```ts
Text("Helvetica is the default");
Text("A serif heading", { font: "Times-Roman", bold: true });
Text("Monospaced code", { font: "Courier" });
```

The family names are `Helvetica`, `Times-Roman` and `Courier`. They cover Latin text (Windows-1252),
including the Euro sign and accented characters.

## Embedding your own font

Register a font on the document with `addFont(name, source)`, then use that name as `font` on any
`Text`. The source is a `.ttf` path (jasy reads it on Node), the raw bytes, or a per-style family.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Column, Text, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 10 }, [
        Text("Set in Inter", { font: "Inter", size: 22 }),
        Text("Full Unicode too: Привет, Γειά, čeština", { font: "Inter" }),
      ]),
    ]),
  ]);

  doc.addFont("Inter", "Inter-Regular.ttf"); // a path - jasy reads it

  writeFileSync("typed.pdf", await renderToBytes(doc));
}

build();
```

The name is what you pass to `Text({ font })`. A custom font also unlocks full Unicode (Cyrillic,
Greek, Latin Extended), which the standard fonts cannot show. (No shaping or ligatures: one character
maps to one glyph.)

Already hold the bytes (say, a browser upload)? Pass them instead of a path:

```ts
import { readFileSync } from "node:fs";
doc.addFont("Inter", readFileSync("Inter-Regular.ttf"));
```

### Managing the registry

The document owns its fonts, so you can ask it what is registered - and you never have to deregister:

```ts
doc.getFonts(); // ["Inter"]  - the registered names
doc.hasFont("Inter"); // true
doc.addFont("Inter", "..."); // re-adding a name overwrites it
```

A font you register but never use on a `Text` is **dropped at render and costs nothing**. Register
freely; only the faces you actually use are embedded.

## Bold, italic and a whole family

Register the faces of a family under one name and jasy picks the right one for `bold` / `italic`. A
requested style you did not register falls back to the family's regular face, cleanly.

```ts
doc.addFont("Inter", {
  normal: "Inter-Regular.ttf",
  bold: "Inter-Bold.ttf",
  italic: "Inter-Italic.ttf",
  boldItalic: "Inter-BoldItalic.ttf",
});
```

```ts
Text("Bold Inter", { font: "Inter", bold: true });
Text("Italic Inter", { font: "Inter", italic: true });
```

Only `normal` is required; add `bold` / `italic` / `boldItalic` as you have them, each a path or bytes.

## What jasy does for you

- **Subsetting** - only the glyphs you use are embedded (a 740 KB font drops to tens of KB).
- **Compression** - the embedded program is FlateDecode-compressed.
- **Copy and search** - a `ToUnicode` map ships with the font, so the text stays selectable and
  searchable in the reader.

Supported today: TrueType (`.ttf`) and TrueType-flavoured OpenType. OTF/CFF and WOFF2 are not parsed
yet.
