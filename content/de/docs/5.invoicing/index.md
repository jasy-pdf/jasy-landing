---
title: ZUGFeRD- und XRechnung-E-Rechnungen in TypeScript
description: Gültige ZUGFeRD- und XRechnung-E-Rechnungen in Node.js erzeugen - das PDF/A-3 und das EN-16931-XML - aus einem typisierten Objekt, geprüft mit den KoSIT-Regeln und veraPDF.
navigation:
  title: E-Rechnungen
---

# E-Rechnungen

Eine ZUGFeRD- oder XRechnung-Rechnung ist ein PDF, das ganz normal aussieht und die Rechnung **zusätzlich**
als maschinenlesbares XML in sich trägt. Der Mensch liest das PDF, das System des Käufers liest die
eingebetteten EN-16931-Daten. Deutschland schreibt das für B2B und B2G inzwischen vor, und der Rest der EU
geht denselben Weg.

`@jasy/e-invoice` baut beide Hälften aus einer einzigen typisierten `Invoice`: ein gültiges PDF/A-3 mit
eingebettetem EN-16931-CII-XML, jede Summe und jede Steuerzeile **für Sie berechnet**. Kein Java, kein
Dienst, keine Tabellenkalkulation.

> Die anderen Ökosysteme haben Mustangproject (Java), horstoeko/zugferd (PHP) und factur-x (Python). Node
> hatte nichts Ausgereiftes. Jetzt schon.

## Installation

```bash
pnpm add @jasy/e-invoice
```

Das Paket bringt `@jasy/pdf` selbst mit, Sie brauchen also nur dieses eine.

## Auf einen Blick

Sie beschreiben die Rechnung als ein typisiertes Objekt, `renderZugferd` gibt beide Hälften zurück. Sie
addieren nie eine Zeile, eine Zwischensumme oder eine Steueraufschlüsselung.

```ts
const { bytes, xml } = await renderZugferd(invoice);
// bytes - ein gültiges ZUGFeRD-PDF/A-3 mit eingebettetem EN-16931-XML
// xml   - dasselbe EN-16931-CII, einzeln für den Upload in ein Portal
```

Das ist schon die ganze Form. Eine Rechnung, die Sie kopieren und von Anfang bis Ende ausführen können,
steht im [vollständigen Beispiel](/de/docs/invoicing/complete-example).

## Was Sie bekommen

- Ein **PDF/A-3** mit eingebetteter `factur-x.xml`, einem Factur-X-XMP-Paket und einem sRGB-Output-Intent -
  die Struktur, die Prüfprogramme erwarten.
- Das **EN-16931-CII-XML**, den rechtlich maßgeblichen Teil, zusätzlich einzeln für den Upload in ein Portal.
- **Summen, die per Konstruktion stimmen:** Zeilennetto, Belegsummen und Steueraufschlüsselung werden aus
  Ihren Angaben abgeleitet, also halten die Geschäftsregeln, die die Rechnung nachrechnen, von selbst.

## Wie es weitergeht

- [**Das Invoice-Modell**](/de/docs/invoicing/invoice-model) - jedes Feld, das Sie setzen können, von den Parteien bis zur Steuer.
- [**Profile**](/de/docs/invoicing/profiles) - ZUGFeRD (EN 16931) oder XRechnung, CII oder UBL.
- [**Ihr eigenes Layout**](/de/docs/invoicing/appearance) - die Sprache, die Beschriftungen oder eine Seite ganz nach Ihrem Entwurf.
- [**Prüfung**](/de/docs/invoicing/validation) - die eingebaute Vorabprüfung und wie Sie selbst prüfen.
- [**Ein vollständiges Beispiel**](/de/docs/invoicing/complete-example) - die Felder auf einen Blick, ein ganzes Muster, der Beweis mit der Kommandozeile.
- [**Die Kommandozeile**](/de/docs/cli) - jede Rechnung im Terminal lesen, prüfen und exportieren.
