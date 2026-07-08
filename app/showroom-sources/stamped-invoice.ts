// An invoice with a diagonal "BEZAHLT" (paid) stamp laid across it. The stamp is a rotated box placed
// out of flow: `Rotated` spins it around its center at any angle, and `Positioned` centers it on the
// card. `Rotated` is paint-only, so the stamp never disturbs the invoice layout underneath it.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Text,
  Divider,
  Table,
  Spacer,
  Positioned,
  Rotated,
} from "@jasy/pdf";

const ink = "#1b2433";
const muted = "#6b7280";
const brand = "#1450aa";
const hair = "#e6eaf2";
const paper = "#f5f8fd";
const red = "#c0392b";

const eur = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

type Item = { qty: number; name: string; price: number };
const items: Item[] = [
  { qty: 2, name: "Brand identity workshop", price: 680 },
  { qty: 1, name: "Logo design, primary and variants", price: 1450 },
  { qty: 1, name: "Visual identity guidelines", price: 920 },
  { qty: 3, name: "UI design, key screens", price: 540 },
  { qty: 1, name: "Design system in Figma", price: 1680 },
];

const net = items.reduce((s, it) => s + it.qty * it.price, 0);
const vat = net * 0.19;
const gross = net + vat;

const rows = items.map((it) => [it.name, String(it.qty), eur(it.price), eur(it.qty * it.price)]);

export const stampedInvoice = Document({ font: "Helvetica", color: ink }, [
  Page({ size: "A4", margin: 48 }, [
    // A relative frame so the stamp can be positioned over the whole invoice.
    Box({ relative: true, borderWidth: 0 }, [
      Column({ gap: 18 }, [
        Row({ align: "start" }, [
          Column({ gap: 2 }, [
            Text("STUDIO NORD", { size: 20, bold: true, color: brand }),
            Text("Design & Frontend", { size: 10, color: muted }),
          ]),
          Spacer(),
          Column({ gap: 2, align: "end" }, [
            Text("INVOICE", { size: 20, bold: true }),
            Text("No. 2026-014", { size: 10, color: muted }),
            Text("2026-07-08", { size: 10, color: muted }),
          ]),
        ]),
        Box({ bg: paper, radius: 8, padding: 14 }, [
          Row({}, [
            Column({ gap: 1 }, [
              Text("Billed to", { size: 9, color: muted }),
              Text("Meridian GmbH", { size: 12, bold: true }),
              Text("Hafenstrasse 12, 20095 Hamburg", { size: 10, color: muted }),
            ]),
            Spacer(),
            Column({ gap: 1, align: "end" }, [
              Text("Due", { size: 9, color: muted }),
              Text("2026-07-22", { size: 12, bold: true }),
              Text("Net 14 days", { size: 10, color: muted }),
            ]),
          ]),
        ]),
        Table(
          {
            columns: ["3fr", "0.6fr", "1fr", "1fr"],
            header: ["Description", "Qty", "Unit", "Amount"],
            cellPadding: { x: 4, y: 6 },
            rule: hair,
          },
          rows,
        ),
        Row({}, [
          Spacer(),
          Column({ gap: 4, width: "42%" }, [
            Row({}, [Text("Net", { size: 11, color: muted }), Spacer(), Text(eur(net), { size: 11 })]),
            Row({}, [
              Text("VAT 19%", { size: 11, color: muted }),
              Spacer(),
              Text(eur(vat), { size: 11 }),
            ]),
            Divider({ color: hair }),
            Row({}, [
              Text("Total", { size: 13, bold: true, color: brand }),
              Spacer(),
              Text(eur(gross), { size: 13, bold: true, color: brand }),
            ]),
          ]),
        ]),
        Text("Thank you for your business.", { size: 10, color: muted }),
      ]),
      // The stamp: out of flow, centered on the invoice and rotated -18 degrees.
      Positioned(
        { h: "center", v: "center" },
        Rotated(
          { angle: -18 },
          Box({ border: red, borderWidth: 4, radius: 12, padding: { x: 26, y: 12 } }, [
            Text("BEZAHLT", { size: 40, bold: true, color: red }),
          ]),
        ),
      ),
    ]),
  ]),
]);
