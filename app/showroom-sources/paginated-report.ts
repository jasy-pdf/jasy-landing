// A report that runs over several pages - the showcase for page numbers. `PageBuilder` hands you the
// page's facts and draws whatever you return, so the header can change after page 1 and the footer can
// print "Page X of Y". `PageNumber` and `PageCount` are one-word sugar over the same primitive, and they
// work anywhere - including inline in the flowing body, as the summary box below shows.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Divider,
  Text,
  Paragraph,
  PageBuilder,
  PageNumber,
  PageCount,
} from "@jasy/pdf";

const ink = "#1f2a37";
const brand = "#1450aa";
const muted = "#6b7280";
const hair = "#dfe4ee";

const body =
  "Revenue grew across every region, with the strongest contribution from the enterprise segment. " +
  "Gross margin improved by two points as the platform migration retired the last of the legacy " +
  "infrastructure. Operating expenses stayed flat despite headcount growth, and free cash flow turned " +
  "positive in the second half. ";

// The full masthead on page one, a quiet continuation line afterwards. A conditional header may shrink
// on later pages, never grow - the body band is measured against the first build.
const header = PageBuilder(({ pageNumber }) =>
  pageNumber === 1
    ? Row({ justify: "between", align: "end" }, [
        Text("Acme Inc.", { size: 20, bold: true, color: brand }),
        Text("Annual Report 2026", { size: 10, color: muted }),
      ])
    : Text("Annual Report 2026 (continued)", { size: 9, color: muted }),
);

// The classic page furniture: a rule, the confidentiality note, and "Page X of Y".
const footer = PageBuilder(({ pageNumber, pageCount }) =>
  Column([
    Divider({ color: hair }),
    Box({ height: 6 }, []),
    Row({ justify: "between" }, [
      Text("Confidential", { size: 8.5, color: muted }),
      Text(`Page ${pageNumber} of ${pageCount}`, { size: 8.5, color: muted }),
    ]),
  ]),
);

export default Document({ size: 11, color: ink, lineHeight: 1.5 }, [
  Page({ size: "A4", margin: 56, header, footer }, [
    Column({ gap: 10 }, [
      // The same numbers, inline in the body - and once more with a cover page discounted.
      Box({ bg: "#f4f6fb", padding: 10, radius: 6 }, [
        Row({ gap: 5, align: "center" }, [
          Text("You are reading page", { size: 10, color: muted }),
          PageNumber({ size: 10, bold: true, color: brand }),
          Text("of", { size: 10, color: muted }),
          PageCount({ size: 10, bold: true, color: brand }),
          Text("- excluding the cover:", { size: 10, color: muted }),
          PageNumber({ size: 10, bold: true, color: brand, offset: -1 }),
        ]),
      ]),

      Text("Financial review", { size: 14, bold: true, color: ink }),
      ...Array.from({ length: 16 }, () => Paragraph(body.repeat(2))),
    ]),
  ]),
]);
