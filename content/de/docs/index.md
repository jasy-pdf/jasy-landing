---
title: Einführung
description: jasy ist ein Toolkit in reinem TypeScript, das PDFs und E-Rechnungen nach ZUGFeRD und XRechnung erzeugt.
navigation:
  title: Einführung
---

# jasy

Der Name steht für **ja**vaScript ea**sy** PDF, und genau das ist das Ziel: ein Toolkit in reinem
TypeScript, das PDFs baut, und die erste Node-Bibliothek, die E-Rechnungen nach ZUGFeRD und XRechnung
vollständig abdeckt - erzeugen, prüfen und lesen. Kein Java, kein Headless-Browser, kein Upload. Ihre
Daten verlassen nie Ihren Rechner.

## Die Pakete

| Paket             | Was es tut                                                                       |
| ----------------- | -------------------------------------------------------------------------------- |
| `@jasy/pdf`       | die deklarative PDF-Engine im Stil von Flutter                                   |
| `@jasy/vue`       | PDFs als Vue-Komponenten, gerendert im Browser oder auf dem Server               |
| `@jasy/react`     | PDFs als React-Komponenten, gerendert im Browser oder auf dem Server             |
| `@jasy/nuxt`      | das Nuxt-Modul: PDFs ohne Konfiguration, im Client oder in einer Server-Route    |
| `@jasy/e-invoice` | ZUGFeRD / XRechnung: aus Ihren Daten ein konformes PDF/A-3 mit XML nach EN 16931 |
| `@jasy/cli`       | das Terminal `jasy`: Rechnungen lesen, prüfen und exportieren                    |

## Installation

Wählen Sie das Paket für Ihre Aufgabe. jasy ist in der Beta, und `latest` ist die Beta.

```bash
pnpm add @jasy/pdf             # PDFs bauen
pnpm add @jasy/vue vue          # PDFs als Vue-Komponenten
pnpm add @jasy/react @jasy/pdf react  # PDFs als React-Komponenten
npx nuxi module add @jasy/nuxt  # das Nuxt-Modul
pnpm add @jasy/e-invoice        # E-Rechnungen bauen (bringt @jasy/pdf mit)
pnpm add -g @jasy/cli           # das Kommandozeilen-Werkzeug
```

## Wie es weitergeht

- [**PDFs erstellen**](/de/docs/pdf) (englisch) - die Engine, vom einzeiligen Hallo bis zum vollen Layout.
- [**PDFs in Vue**](/de/docs/vue) (englisch) - Dokumente als Vue-Komponenten, gerendert im Browser.
- [**PDFs in Nuxt**](/de/docs/nuxt) (englisch) - das Modul ohne Konfiguration, im Client oder auf dem Server.
- [**PDFs in React**](/de/docs/react) (englisch) - Dokumente als React-Komponenten, gerendert im Browser.
- [**E-Rechnungen**](/de/docs/invoicing) - ZUGFeRD / XRechnung erzeugen und prüfen.
- [**Die CLI**](/de/docs/cli) - jede Rechnung im Terminal lesen, prüfen und exportieren.
