<script setup lang="ts">
definePageMeta({ i18n: { locales: ["de"] } });

// German pillar page for the B2B e-invoice mandate. Every legal statement here is taken from the norm it
// links (UStG, UStDV on gesetze-im-internet.de) - change the text only against the norm, never from memory.
const title = "E-Rechnungspflicht 2025, 2027, 2028: XRechnung und ZUGFeRD erstellen und prüfen";
const description =
  "Seit 2025 müssen Unternehmen E-Rechnungen empfangen, ab 2027 und 2028 auch ausstellen. Was gilt, welche Formate zählen, welche Ausnahmen es gibt - und wie Sie XRechnung und ZUGFeRD in TypeScript erzeugen und prüfen.";
const updated = "2026-11-06";

const timeline = [
  {
    date: "1. Januar 2025",
    title: "Empfangen ist Pflicht",
    text: "Eine E-Rechnung braucht keine Zustimmung des Empfängers mehr. Wer Rechnungen von Unternehmen bekommt, muss sie entgegennehmen und verarbeiten können.",
  },
  {
    date: "bis 31. Dezember 2026",
    title: "Übergang für alle",
    text: "Jedes Unternehmen darf noch Papier oder - mit Zustimmung des Empfängers - ein anderes elektronisches Format wie ein einfaches PDF verschicken.",
  },
  {
    date: "bis 31. Dezember 2027",
    title: "Übergang für Kleinere",
    text: "Nur noch, wer im Vorjahr höchstens 800.000 Euro Gesamtumsatz hatte. Rechnungen über EDI sind mit Zustimmung des Empfängers ebenfalls bis Ende 2027 erlaubt.",
  },
  {
    date: "ab 1. Januar 2028",
    title: "Ausstellen ist Pflicht",
    text: "Zwischen Unternehmen im Inland ist jede Rechnung eine E-Rechnung - von Ausnahmen wie Kleinbetragsrechnungen abgesehen.",
  },
];

const formats = [
  {
    name: "XRechnung",
    what: "Reines XML (Syntax CII oder UBL), die deutsche Ausprägung der EN 16931.",
    when: "Pflicht gegenüber Behörden (B2G), überall im B2B verwendbar.",
  },
  {
    name: "ZUGFeRD / Factur-X",
    what: "Ein lesbares PDF/A-3 mit eingebettetem EN-16931-XML - Mensch und Maschine lesen dieselbe Datei.",
    when: "Der Standard im B2B: der Kunde sieht ein PDF, seine Buchhaltung liest die Daten.",
  },
];

const faq = [
  {
    q: "Ist ein PDF per E-Mail eine E-Rechnung?",
    a: "Nein. Eine E-Rechnung ist eine Rechnung in einem strukturierten elektronischen Format, das eine elektronische Verarbeitung ermöglicht (§ 14 Abs. 1 UStG). Ein einfaches PDF ist eine „sonstige Rechnung“ und nur noch in den Übergangsfristen erlaubt. Ein ZUGFeRD-PDF dagegen trägt das strukturierte XML in sich.",
  },
  {
    q: "Ab wann muss ich E-Rechnungen ausstellen?",
    a: "Ab dem 1. Januar 2027. Wer im Vorjahr höchstens 800.000 Euro Gesamtumsatz hatte, darf bis Ende 2027 noch sonstige Rechnungen verschicken; ab dem 1. Januar 2028 gilt die Pflicht für alle Unternehmen im Inland (§ 27 Abs. 38 UStG).",
  },
  {
    q: "Muss ich schon jetzt E-Rechnungen empfangen können?",
    a: "Ja, seit dem 1. Januar 2025. Die Übergangsregeln betreffen nur das Ausstellen, nicht das Empfangen.",
  },
  {
    q: "XRechnung oder ZUGFeRD - was brauche ich?",
    a: "Beide erfüllen die europäische Norm EN 16931. Gegenüber Behörden ist XRechnung vorgeschrieben. Im B2B ist ZUGFeRD verbreitet, weil die Datei zugleich ein lesbares PDF ist.",
  },
  {
    q: "Welche Rechnungen sind ausgenommen?",
    a: "Kleinbetragsrechnungen bis 250 Euro (§ 33 UStDV) und Fahrausweise (§ 34 UStDV) dürfen immer als sonstige Rechnung übermittelt werden. Steuerfreie Umsätze nach § 4 Nr. 8 bis 29 UStG und Rechnungen an Privatpersonen fallen nicht unter die Pflicht.",
  },
  {
    q: "Wie prüfe ich, ob eine E-Rechnung gültig ist?",
    a: "Mit den offiziellen Regeln: den EN-16931-Geschäftsregeln der KoSIT für die Daten und veraPDF, dem Referenz-Validator für PDF/A, für die Datei. Unser kostenloser Prüfdienst führt genau diese Prüfungen aus, für Rechnungen aus jedem Programm.",
  },
];

const sources = [
  {
    label: "§ 14 UStG - Ausstellung von Rechnungen",
    href: "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
  },
  {
    label: "§ 27 Abs. 38 UStG - Übergangsregelungen",
    href: "https://www.gesetze-im-internet.de/ustg_1980/__27.html",
  },
  {
    label: "§ 33 UStDV - Kleinbetragsrechnungen",
    href: "https://www.gesetze-im-internet.de/ustdv_1980/__33.html",
  },
  {
    label: "§ 34 UStDV - Fahrausweise",
    href: "https://www.gesetze-im-internet.de/ustdv_1980/__34.html",
  },
];

const code = `import { writeFileSync } from "node:fs";
import { renderZugferd, type Invoice } from "@jasy/e-invoice";

const rechnung: Invoice = {
  number: "RE-2027-001",
  issueDate: "2027-01-15",
  currency: "EUR",
  dueDate: "2027-01-29",
  seller: {
    name: "Muster GmbH",
    vatId: "DE265013614",
    address: { line1: "Hauptstraße 1", city: "Berlin", postCode: "10115", country: "DE" },
    contact: { name: "A. Schmidt", email: "rechnung@muster.de", phone: "+49 30 123456" },
  },
  buyer: {
    name: "Beispiel AG",
    address: { line1: "Marktplatz 5", city: "München", postCode: "80331", country: "DE" },
  },
  lines: [
    { name: "Beratung", quantity: 8, unit: "HUR", netUnitPrice: 120,
      vat: { category: "S", ratePercent: 19 } },
    { name: "Lizenz", quantity: 1, unit: "C62", netUnitPrice: 480,
      vat: { category: "S", ratePercent: 19 } },
  ],
  payment: { iban: "DE89370400440532013000", terms: "Zahlbar innerhalb von 14 Tagen ohne Abzug." },
};

const { bytes, xml } = await renderZugferd(rechnung);
writeFileSync("rechnung.pdf", bytes); // ZUGFeRD: PDF/A-3 mit eingebettetem XML
writeFileSync("rechnung.xml", xml); // die EN-16931-Daten (CII), z. B. für ein Portal`;

useHead({
  title,
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: title,
            description,
            inLanguage: "de-DE",
            dateModified: updated,
            author: { "@type": "Person", name: "Florian Heuberger" },
            publisher: { "@type": "Organization", name: "jasy", url: "https://jasy.dev" },
            mainEntityOfPage: "https://jasy.dev/de/e-rechnung",
            about: ["E-Rechnung", "XRechnung", "ZUGFeRD", "EN 16931"],
          },
          {
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }),
    },
  ],
});
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
});
</script>

<template>
  <article class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="relative mx-auto max-w-368 px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <header class="mx-auto max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          E-Rechnung <span class="text-brand-400">·</span> XRechnung
          <span class="text-brand-400">·</span> ZUGFeRD
        </p>
        <h1
          class="mt-5 font-display text-[2.2rem] font-bold leading-[1.08] tracking-tight text-brand-900 sm:text-5xl dark:text-white"
        >
          Die E-Rechnungspflicht: was ab 2025, 2027 und 2028 gilt
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          Rechnungen zwischen Unternehmen in Deutschland werden elektronisch - nicht als PDF im
          Anhang, sondern als strukturierte Daten nach der europäischen Norm EN 16931. Hier steht,
          was das Gesetz verlangt, ab wann, für wen - und wie Sie gültige XRechnungen und
          ZUGFeRD-Rechnungen selbst erzeugen und prüfen.
        </p>
        <p class="mt-3 text-sm text-brand-900/50 dark:text-white/40">
          Stand: 6. November 2026 · Quellen am Ende der Seite
        </p>
      </header>

      <section class="mx-auto mt-14 max-w-5xl" aria-labelledby="zeitplan">
        <h2
          id="zeitplan"
          class="font-display text-2xl font-bold text-brand-900 sm:text-3xl dark:text-white"
        >
          Der Zeitplan auf einen Blick
        </h2>
        <ol class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="step in timeline"
            :key="step.date"
            class="rounded-2xl border border-brand-200/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p class="spec-label text-brand-600 dark:text-brand-300">{{ step.date }}</p>
            <h3 class="mt-2 font-display text-lg font-bold text-brand-900 dark:text-white">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
              {{ step.text }}
            </p>
          </li>
        </ol>
      </section>

      <div class="mx-auto mt-16 max-w-3xl space-y-14">
        <section aria-labelledby="was">
          <h2 id="was" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            Was ist eine E-Rechnung?
          </h2>
          <p class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70">
            Eine E-Rechnung ist eine Rechnung in einem strukturierten elektronischen Format, das
            eine elektronische Verarbeitung ermöglicht. Das Format muss der europäischen Norm EN
            16931 entsprechen - oder ein vereinbartes Format sein, aus dem sich alle Angaben richtig
            und vollständig in ein solches Format übertragen lassen. Ein PDF, ein Scan oder ein
            Word-Dokument ist keine E-Rechnung, sondern eine „sonstige Rechnung“.
          </p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div
              v-for="f in formats"
              :key="f.name"
              class="rounded-2xl border border-brand-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
            >
              <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">
                {{ f.name }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
                {{ f.what }}
              </p>
              <p class="mt-2 text-sm leading-relaxed text-brand-900/70 dark:text-white/65">
                {{ f.when }}
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="ausnahmen">
          <h2 id="ausnahmen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            Wer ist ausgenommen?
          </h2>
          <ul
            class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-brand-900/75 dark:text-white/70"
          >
            <li>
              Kleinbetragsrechnungen bis 250 Euro - sie dürfen immer als sonstige Rechnung gehen.
            </li>
            <li>Fahrausweise, etwa Bahn- und Bustickets.</li>
            <li>
              Steuerfreie Umsätze nach § 4 Nr. 8 bis 29 UStG, zum Beispiel viele Finanz- und
              Heilberufe.
            </li>
            <li>Rechnungen an Privatpersonen - die Pflicht gilt zwischen Unternehmen im Inland.</li>
          </ul>
        </section>

        <section aria-labelledby="erzeugen">
          <h2 id="erzeugen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            E-Rechnungen in TypeScript und Node.js erzeugen
          </h2>
          <p class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70">
            Mit <code class="font-mono text-brand-700 dark:text-brand-200">@jasy/e-invoice</code>
            beschreiben Sie die Rechnung einmal als Objekt. Daraus entstehen beide Hälften: das
            lesbare PDF/A-3 und die EN-16931-Daten. Summen, Steuerbeträge und die Aufschlüsselung
            nach Steuersätzen werden berechnet, nicht getippt. Kein Java, kein externer Dienst -
            Ihre Daten verlassen Ihren Server nicht.
          </p>
          <div
            class="mt-6 overflow-hidden rounded-2xl border border-brand-200/70 shadow-sm dark:border-white/10"
          >
            <div
              class="flex items-center justify-between gap-3 border-b border-brand-100 bg-white/70 px-4 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <span class="font-mono text-xs text-brand-600 dark:text-brand-300">rechnung.ts</span>
              <code class="font-mono text-xs text-brand-500 dark:text-brand-300"
                >pnpm add @jasy/e-invoice</code
              >
            </div>
            <pre
              class="overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
            ><code>{{ code }}</code></pre>
          </div>
          <p class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70">
            Genau diese Rechnung besteht die EN-16931-Geschäftsregeln der KoSIT und die
            PDF/A-3-Prüfung von veraPDF. Für eine Behörde schreiben Sie
            <code class="font-mono text-brand-700 dark:text-brand-200"
              >renderZugferd(rechnung, { profile: "xrechnung" })</code
            >
            - fehlt dann eine Pflichtangabe wie die Leitweg-ID, sagt Ihnen die Bibliothek vorher,
            welches Feld.
          </p>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <UButton
              to="/docs/invoicing"
              color="primary"
              icon="i-lucide-book-open"
              label="Zur Dokumentation (englisch)"
            />
            <UButton
              to="/docs/invoicing/profiles"
              color="neutral"
              variant="outline"
              label="XRechnung oder ZUGFeRD"
            />
          </div>
        </section>

        <section aria-labelledby="pruefen">
          <h2 id="pruefen" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            E-Rechnungen prüfen - auch die von anderen Programmen
          </h2>
          <p class="mt-4 leading-relaxed text-brand-900/75 dark:text-white/70">
            Gültig ist eine E-Rechnung erst, wenn sie die offiziellen Regeln besteht: die
            EN-16931-Geschäftsregeln der KoSIT für die Daten und veraPDF, den Referenz-Validator für
            PDF/A, für die Datei. Unser kostenloser Prüfdienst führt genau diese Prüfungen aus - für
            jede XRechnung und jede ZUGFeRD-Rechnung, egal aus welchem Programm. Die Datei wird
            geprüft und sofort gelöscht, nichts wird gespeichert. Wer gar nichts hochladen will,
            prüft komplett lokal mit der Kommandozeile:
            <code class="font-mono text-brand-700 dark:text-brand-200"
              >jasy validate rechnung.pdf</code
            >.
          </p>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <UButton
              to="/de/e-rechnung-pruefen"
              color="primary"
              icon="i-lucide-shield-check"
              label="E-Rechnung jetzt prüfen"
            />
            <UButton to="/docs/cli" color="neutral" variant="outline" label="Die Kommandozeile" />
          </div>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" class="font-display text-2xl font-bold text-brand-900 dark:text-white">
            Häufige Fragen
          </h2>
          <div class="mt-5 divide-y divide-brand-100 dark:divide-white/10">
            <details v-for="f in faq" :key="f.q" class="group py-4">
              <summary
                class="cursor-pointer list-none font-semibold text-brand-900 marker:hidden dark:text-white"
              >
                {{ f.q }}
              </summary>
              <p class="mt-2 leading-relaxed text-brand-900/70 dark:text-white/65">{{ f.a }}</p>
            </details>
          </div>
        </section>

        <section aria-labelledby="quellen">
          <h2 id="quellen" class="font-display text-xl font-bold text-brand-900 dark:text-white">
            Quellen
          </h2>
          <ul class="mt-3 space-y-1.5 text-sm">
            <li v-for="s in sources" :key="s.href">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener"
                class="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                >{{ s.label }}</a
              >
            </li>
          </ul>
          <p class="mt-4 text-sm text-brand-900/50 dark:text-white/40">
            Diese Seite erklärt die Rechtslage, sie ist keine Steuerberatung.
          </p>
        </section>
      </div>
    </div>
  </article>
</template>
