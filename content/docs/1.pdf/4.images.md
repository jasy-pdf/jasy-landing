---
title: Images
description: Place raster images with object-fit style scaling and rounded corners.
navigation:
  title: Images
---

# Images

`Image` places a raster image (PNG or JPEG). You give it a source and a box, and it scales the image
into that box the way CSS `object-fit` does.

```ts
import { Image } from "@jasy/pdf";

Image("logo.png", { width: 120, height: 90, fit: "contain" });
```

The source is a local file path on Node. (A browser-supplied image goes through `CustomImage`; see the
engine reference.)

## Fitting the box

`fit` controls how the image fills its `width` x `height` box. It mirrors CSS `object-fit`.

| `fit`       | What it does                                                          |
| ----------- | --------------------------------------------------------------------- |
| `"none"`    | the image's natural size, no scaling (the default)                    |
| `"contain"` | scaled down to fit inside the box, whole image visible, may letterbox |
| `"cover"`   | scaled to fill the box, cropped to the edges, no distortion           |
| `"fill"`    | stretched to the box exactly, may distort                             |

```ts
Image("photo.jpg", { width: 160, height: 100, fit: "cover" });
```

## Options

| Prop             | Type                                       | What it does                                               |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `width` `height` | `number`                                   | the box the image is fitted into, in points                |
| `fit`            | `"none" \| "contain" \| "cover" \| "fill"` | how the image fills the box (default `"none"`)             |
| `radius`         | `number`                                   | rounds the image box; set it to half the side for a circle |

## Rounded and circular

`radius` rounds the image box (the image is clipped to the rounded rect). A square image with a radius
of half its side becomes a circle, perfect for an avatar.

```ts
Image("avatar.jpg", { width: 96, height: 96, fit: "cover", radius: 48 });
```

## See it all in one file

Copy this next to an image named `photo.png` and run it with `npx tsx images.ts`.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Row, Column, Text, Image, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 16 }, [
        Text("Images", { size: 22, bold: true, color: "#1450aa" }),
        Row({ gap: 16 }, [
          Image("photo.png", { width: 120, height: 90, fit: "contain" }),
          Image("photo.png", { width: 120, height: 90, fit: "cover" }),
          Image("photo.png", { width: 90, height: 90, fit: "cover", radius: 45 }),
        ]),
      ]),
    ]),
  ]);

  writeFileSync("images.pdf", await renderToBytes(doc));
}

build();
```
