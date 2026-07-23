// Page-break control. jasy paginates on its own, but you can override it: PageBreak() and the
// breakBefore / breakAfter props force a new page, and keepTogether does the opposite - it stops a block
// from being split across the boundary. Here three short notes are each pinned to their own page, and the
// sign-off box is kept whole. Remove the props and the whole thing collapses onto a single page.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Divider,
  Text,
  Paragraph,
  keepTogether,
} from "@jasy/pdf";

const ink = "#1f2a37";
const brand = "#1450aa";
const muted = "#6b7280";
const hair = "#dfe4ee";

const header = Row({ justify: "between", align: "end" }, [
  Text("Jasy Field Notes", { size: 18, bold: true, color: brand }),
  Text("Release 1.0.0-alpha.7", { size: 9, color: muted }),
]);

// `fresh: true` puts breakBefore on the note, so it starts on a new page.
const note = (title: string, body: string, fresh?: boolean) =>
  Box({ breakBefore: fresh, padding: { y: 4 } }, [
    Column({ gap: 6 }, [Text(title, { size: 14, bold: true }), Paragraph(body)]),
  ]);

// A sign-off block wrapped in keepTogether, so a page break can never cut it in half.
const signoff = keepTogether([
  Box({ border: hair, bg: "#f6f8fc", padding: 12, radius: 6 }, [
    Column({ gap: 6 }, [
      Text("Sign-off", { size: 12, bold: true, color: brand }),
      Text("Reviewed by ...................................."),
      Text("Approved by ..................................."),
      Text("Date .............................................."),
    ]),
  ]),
]);

export default Document({ size: 11, color: ink, lineHeight: 1.5 }, [
  Page({ size: "A4", margin: 56, header, gap: 12 }, [
    Text("Page-break control", { size: 24, bold: true }),
    Paragraph(
      "Every release note below is short, but each one is pinned to its own page on purpose. jasy " +
        "paginates automatically - here we override it, the way you would in a real report.",
      { color: muted },
    ),
    Divider({ color: hair }),

    note(
      "1. Overview",
      "This first note stays on page one. It is deliberately short - there is plenty of room left below " +
        "it, which is exactly what makes the next break visible.",
    ),

    note(
      "2. Forced onto a fresh page",
      "This note carries breakBefore, so it starts on page two even though note one left most of page " +
        "one empty. Page one ends early - that gap is the point.",
      true,
    ),

    signoff,

    note(
      "3. Kept together",
      "PageBreak() and the breakBefore / breakAfter props force a break; keepTogether does the opposite " +
        "- it refuses to let a block be split across a page boundary, so the sign-off box on page two is " +
        "never cut in half, wherever it lands.",
      true,
    ),
  ]),
]);
