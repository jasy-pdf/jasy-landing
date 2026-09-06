// A quarterly report page whose figures are DRAWN: a bar chart with a target line, and a donut, both
// from Canvas - the imperative escape hatch. The axes are ordinary Text in the layout, so they stay
// selectable and searchable; only the graphics come from the pen.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Text,
  Canvas,
  Expanded,
  Spacer,
  Divider,
  linearGradient,
  type CanvasPainter,
} from "@jasy/pdf";

const ink = "#0a2348";
const brand = "#1450aa";
const muted = "#8a8f98";
const hair = "#e4e8ee";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REVENUE = [42, 51, 47, 66, 58, 74, 69, 88, 81, 96, 87, 112];
const TARGET = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
const TICKS = [0, 30, 60, 90, 120];
const MAX = 120;

const SPLIT: [string, number, string][] = [
  ["Licences", 52, brand],
  ["Services", 27, "#4d84d6"],
  ["Support", 14, "#f3dc29"],
  ["Other", 7, "#e2483d"],
];

// Bars, a dashed grid and the target line - written against the size the layout hands over, so the
// same function fits a full-width block and a narrow column.
const barChart = (c: CanvasPainter, { width, height }: { width: number; height: number }) => {
  for (const t of TICKS) {
    const y = height - (t / MAX) * height;
    c.move(0, y)
      .line(width, y)
      .stroke(t === 0 ? "#9aa4b2" : hair, {
        width: t === 0 ? 1 : 0.75,
        dash: t === 0 ? undefined : [2, 3],
      });
  }

  const slot = width / REVENUE.length;
  REVENUE.forEach((v, i) => {
    const h = (v / MAX) * height;
    c.rect(i * slot + slot * 0.18, height - h, slot * 0.64, h).fill(
      linearGradient({ angle: 180, stops: [brand, "#7aa5e8"] }),
    );
  });

  const x = (i: number) => i * slot + slot / 2;
  const y = (v: number) => height - (v / MAX) * height;
  c.move(x(0), y(TARGET[0]!));
  TARGET.slice(1).forEach((v, i) => c.line(x(i + 1), y(v)));
  c.stroke(ink, { width: 1.4, cap: "round", join: "round", dash: [5, 3] });
  TARGET.forEach((v, i) => c.circle(x(i), y(v), 1.8).fill(ink));
};

// One arc per slice, drawn as a thick STROKE - that is where the hole comes from, for free.
const donut = (c: CanvasPainter, { width }: { width: number }) => {
  const r = width / 2 - 14;
  const [cx, cy] = [width / 2, width / 2];
  let angle = -90;
  for (const [, value, colour] of SPLIT) {
    const sweep = (value / 100) * 360;
    const a0 = (angle * Math.PI) / 180;
    const a1 = ((angle + sweep) * Math.PI) / 180;
    c.path(
      `M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} ` +
        `A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`,
    ).stroke(colour, { width: 18, cap: "butt" });
    angle += sweep;
  }
};

const label = (t: string) => Text(t, { size: 7.5, color: muted });

const legend = ([name, value, colour]: [string, number, string]) =>
  Row({ gap: 6, align: "center" }, [
    Canvas({ width: 8, height: 8 }, (c) => void c.circle(4, 4, 4).fill(colour)),
    Text(name, { size: 9 }),
    Spacer(),
    Text(`${value}%`, { size: 9, bold: true }),
  ]);

export default Document({ size: 10, color: "#1a1a1a" }, [
  Page({ size: "A4", margin: 48, gap: 18 }, [
    Text("Revenue 2026", { size: 22, bold: true, color: ink }),
    label("Monthly revenue against target, in thousands of euro"),

    Row({ gap: 8, align: "stretch" }, [
      // The y axis is TEXT in the tree, not drawn - it stays copyable and screen-reader friendly.
      Column({ justify: "between", width: 26 }, [...TICKS].reverse().map((t) => label(String(t)))),
      Expanded(
        { flex: 1 },
        Column({ gap: 4 }, [
          Canvas({ height: 170, alt: "Monthly revenue against target" }, barChart),
          Row({ justify: "between" }, MONTHS.map(label)),
        ]),
      ),
    ]),

    Divider({ color: hair }),

    Row({ gap: 24, align: "center" }, [
      Canvas({ width: 130, height: 130, alt: "Revenue by product line" }, donut),
      Column({ gap: 7, width: 200 }, [
        Text("By product line", { size: 12, bold: true, color: ink }),
        ...SPLIT.map(legend),
      ]),
    ]),

    Box({ bg: "#f4f6f9", radius: 8, padding: 14 }, [
      Column({ gap: 5 }, [
        Text("Drawn, not embedded", { size: 11, bold: true, color: ink }),
        Text(
          "Every mark on this page is a vector in the PDF - no bitmap, no chart image, no second " +
            "library. Canvas hands the callback the size the layout resolved, so one function fits " +
            "a full-width block and a narrow column alike.",
          { size: 9, color: muted, lineHeight: 1.45 },
        ),
      ]),
    ]),
  ]),
]);
