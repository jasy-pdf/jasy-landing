---
title: PDFs erstellen mit TypeScript und Node.js
description: Ihr erstes PDF mit @jasy/pdf in wenigen Zeilen TypeScript - in Node oder im Browser - und daraus ein vollständiges Layout über viele Seiten. Ohne Headless-Browser.
navigation:
  title: PDFs erstellen
---

# PDFs erstellen

Mit `@jasy/pdf` beschreiben Sie ein Dokument als Baum aus Komponenten, so wie Sie eine Oberfläche bauen
würden, und die Bibliothek schreibt den PDF-Bytestrom selbst. Kein Headless-Browser, kein Java. Sie setzen
ein paar Grundbausteine zusammen - `Page`, `Column`, `Row`, `Box`, `Text` - und die Engine ordnet sie an.

## Installation

```bash
pnpm add @jasy/pdf
```

Um eine TypeScript-Datei direkt auszuführen und volle Typunterstützung zu bekommen, ergänzen Sie
[`tsx`](https://tsx.is) und die Node-Typdefinitionen als Dev-Abhängigkeiten:

```bash
pnpm add -D tsx @types/node
```

## Ihr erstes PDF

Legen Sie eine Datei an, fügen Sie das hier ein, und Sie haben ein einseitiges PDF. Das funktioniert in
jedem Projekt, egal ob Ihre `package.json` `commonjs` oder `module` verwendet.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Text, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Text("Hello from jasy", { size: 28, bold: true, color: "#1450aa" }),
      Text("Declarative PDFs in pure TypeScript.", { size: 13, color: "gray" }),
    ]),
  ]);

  writeFileSync("hello.pdf", await renderToBytes(doc));
}

build();
```

Führen Sie es mit [`tsx`](https://tsx.is) aus (oder mit Ihrem eigenen Build-Schritt):

```bash
npx tsx hello.ts
```

Öffnen Sie `hello.pdf`, und da ist es. Die Form ändert sich nie: Ein `Document` enthält `Page`s, eine
`Page` enthält Ihren Inhalt, und `renderToBytes` liefert ein `Uint8Array`, das Sie in eine Datei schreiben
oder an einen Browser streamen können. Lieber einen String? Dann nehmen Sie `renderPdf`.

## Ein echtes Dokument

Layouts entstehen aus einer Handvoll Grundbausteine. `Column` stapelt seine Kinder mit einem `gap`,
`Divider` zieht eine Linie, und `Box` umgibt Inhalt mit Hintergrund, Innenabstand und abgerundeten Ecken.

```ts
import { writeFileSync } from "node:fs";
import { Document, Page, Column, Box, Text, Divider, renderToBytes } from "@jasy/pdf";

async function build() {
  const doc = Document([
    Page({ size: "A4", margin: 56 }, [
      Column({ gap: 12 }, [
        Text("Project Report", { size: 30, bold: true, color: "#1450aa" }),
        Text("A second look at the layout primitives.", { size: 13, color: "gray" }),
        Divider({ color: "steelblue" }),
        Box({ bg: "#1450aa11", padding: 16, radius: 8 }, [
          Text("A box with a soft background, padding and rounded corners."),
        ]),
      ]),
    ]),
  ]);

  writeFileSync("report.pdf", await renderToBytes(doc));
}

build();
```

Das ist die ganze Idee. Alles Weitere ist mehr vom Gleichen: mehr Bausteine, mehr Props.

## Wie es weitergeht

- [**Layout**](/de/docs/pdf/layout) (englisch) - `Column`, `Row`, `Box`, Umbruch wie bei Flexbox, Größen und Verläufe.
- [**Text**](/de/docs/pdf/text) (englisch) - Schriftstärke und Farbe, Kerning und Ligaturen, Silbentrennung, rechts-nach-links.
- [**Seiten**](/de/docs/pdf/pages) (englisch) - Kopf- und Fußzeilen, Seitenumbrüche, keine einzelnen Zeilen am Seitenanfang oder -ende, `Seite X von Y`.
- [**Spalten**](/de/docs/pdf/columns) (englisch) - Zeitungsspalten und eigene Layouts, durch die der Text fließt.
- [**SVG und Canvas**](/de/docs/pdf/drawing) (englisch) - ein Logo, das ein Vektor bleibt, und ein Stift für alles andere.
- [**Formulare**](/de/docs/pdf/forms) (englisch) - ausfüllbare Felder, und ein Formular ausfüllen, das jemand anderes gebaut hat.
- [**Navigation**](/de/docs/pdf/navigation) (englisch) - Links ins Web, Sprünge im Dokument und ein Lesezeichenbaum.
- [**Tabellen**](/de/docs/pdf/tables), [**Bilder**](/de/docs/pdf/images), [**Schriften**](/de/docs/pdf/fonts),
  [**Verschlüsselung**](/de/docs/pdf/encryption) und [**Barrierefreiheit**](/de/docs/pdf/accessibility) (englisch).
