// A letterhead whose marks are all VECTORS: the logo comes from SVG markup, the seal and the rule
// from the same vector layer. Nothing on this page is a bitmap, so it stays sharp at any zoom and the
// file stays small - the reason a logo belongs in a PDF as a drawing, not as a PNG.
import { Document, Page, Column, Row, Box, Text, Svg, Image, Divider, Spacer } from "@jasy/pdf";

const ink = "#0a2348";
const brand = "#1450aa";
const muted = "#6b7280";
const hair = "#e4e8ee";

// An ordinary SVG - the kind an agency hands over. Groups, transforms, a gradient, a clip path and
// even-odd fill are all resolved; what jasy cannot draw it names, rather than skipping it silently.
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1450aa"/>
      <stop offset="1" stop-color="#4d84d6"/>
    </linearGradient>
    <clipPath id="ring">
      <path d="M32 4a28 28 0 1 1-.1 0z M32 14a18 18 0 1 0 .1 0z" clip-rule="evenodd"/>
    </clipPath>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#g)" clip-path="url(#ring)"/>
  <path d="M22 32 l7 8 14-16" fill="none" stroke="#0a2348" stroke-width="5"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// A stamp, also SVG - dashed ring, rotated wordmark path, no font needed.
const SEAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2483d" stroke-width="4"
          stroke-dasharray="10 6"/>
  <circle cx="60" cy="60" r="42" fill="none" stroke="#e2483d" stroke-width="2"/>
  <g transform="translate(60 60) rotate(-16)">
    <path d="M-34 -13 h68 v26 h-68 z" fill="#e2483d" opacity="0.10"/>
    <path d="M-22 2 l9 10 22 -24" fill="none" stroke="#e2483d" stroke-width="7"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

const line = (label: string, value: string) =>
  Row({ gap: 6 }, [
    Text(label, { size: 9, color: muted, width: 74 }),
    Text(value, { size: 9, color: ink }),
  ]);

export default Document({ size: 10, color: ink }, [
  Page({ size: "A4", margin: 52, gap: 20 }, [
    Row({ align: "center", gap: 12 }, [
      // Svg() names it explicitly - Image("logo.svg") would do the same for a file on disk.
      Svg(LOGO, { width: 52, alt: "Northwind" }),
      Column({ gap: 1 }, [
        Text("NORTHWIND", { size: 17, bold: true, letterSpacing: 2.4 }),
        Text("studio for brand and print", { size: 8, color: muted, letterSpacing: 0.6 }),
      ]),
      Spacer(),
      Column({ gap: 2, align: "end" }, [
        Text("Northwind Studio GmbH", { size: 9, bold: true }),
        Text("Chausseestrasse 12, 10115 Berlin", { size: 9, color: muted }),
        Text("hello@northwind.example", { size: 9, color: muted }),
      ]),
    ]),

    Divider({ color: hair }),

    Column({ gap: 4 }, [
      Text("Certificate of completion", { size: 20, bold: true }),
      Text("Issued 17 June 2026 - reference NW-2026-0184", { size: 10, color: muted }),
    ]),

    Row({ gap: 28, align: "start" }, [
      Column({ gap: 8, width: 300 }, [
        Text(
          "This document confirms that the work described below was carried out and accepted. " +
            "Every mark on this page - the logo, the seal, the rule - is a vector drawn into the " +
            "PDF, so it prints at any size without a trace of a bitmap.",
          { size: 10, lineHeight: 1.5 },
        ),
        Box({ bg: "#f4f6f9", radius: 8, padding: 14 }, [
          Column({ gap: 5 }, [
            line("Project", "Brand identity"),
            line("Delivered", "12 June 2026"),
            line("Accepted by", "M. Schellenberg"),
          ]),
        ]),
      ]),
      Spacer(),
      // The same source through Image(): an SVG is recognised by its content, not by a flag.
      Image(SEAL, { width: 120 }),
    ]),

    Spacer(),

    Box({ border: hair, radius: 8, padding: 14 }, [
      Row({ gap: 12, align: "center" }, [
        Svg(
          `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="${brand}"
             stroke-width="2"/><path d="M4.5 8.5 L7 11 L11.5 5.5" fill="none" stroke="${brand}"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
          { width: 16 },
        ),
        Text(
          "10,819 real SVG files were run through this reader, and the result compared with " +
            "headless Chrome pixel for pixel.",
          { size: 9, color: muted },
        ),
      ]),
    ]),
  ]),
]);
