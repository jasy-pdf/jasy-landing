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
| `@jasy/angular`   | PDFs in Angular: ein Service, ein Provider und eine Vorschau auf Signals         |
| `@jasy/nuxt`      | das Nuxt-Modul: PDFs ohne Konfiguration, im Client oder in einer Server-Route    |
| `@jasy/e-invoice` | ZUGFeRD / XRechnung: aus Ihren Daten ein konformes PDF/A-3 mit XML nach EN 16931 |
| `@jasy/cli`       | das Terminal `jasy`: Rechnungen lesen, prüfen und exportieren                    |

## Installation

Wählen Sie das Paket für Ihre Aufgabe. jasy ist in der Beta, und `latest` ist die Beta.

```bash
pnpm add @jasy/pdf             # build PDFs
pnpm add @jasy/vue vue          # author PDFs as Vue components
pnpm add @jasy/react @jasy/pdf react  # author PDFs as React components
ng add @jasy/angular            # PDFs in Angular
npx nuxi module add @jasy/nuxt  # the Nuxt module
pnpm add @jasy/e-invoice        # build e-invoices (pulls @jasy/pdf in for you)
pnpm add -g @jasy/cli           # the command-line tool
```

## Wie es weitergeht

- [**PDFs erstellen**](/de/docs/pdf) - die Engine, vom einzeiligen Hallo bis zum vollen Layout.
- [**PDFs in Vue**](/de/docs/vue) - Dokumente als Vue-Komponenten, gerendert im Browser.
- [**PDFs in Nuxt**](/de/docs/nuxt) - das Modul ohne Konfiguration, im Client oder auf dem Server.
- [**PDFs in React**](/de/docs/react) - Dokumente als React-Komponenten, gerendert im Browser.
- [**PDFs in Angular**](/de/docs/angular) - ein Service und eine Vorschau auf Signals, gerendert im Browser.
- [**E-Rechnungen**](/de/docs/invoicing) - ZUGFeRD / XRechnung erzeugen und prüfen.
- [**Die CLI**](/de/docs/cli) - jede Rechnung im Terminal lesen, prüfen und exportieren.
