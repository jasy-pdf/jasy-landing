// A handbook that knows its way around itself - the showcase for navigation. Three mechanisms, one page:
// `Bookmark` fills the viewer's sidebar with a collapsible outline, `Anchor` marks a jump target and
// `Link({ to })` jumps to it, so the contents page is genuinely clickable. `Link({ href })` and an inline
// `span({ href })` open the web. Open the bookmarks panel in your viewer to see the tree.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Divider,
  Spacer,
  Text,
  Paragraph,
  span,
  Link,
  Anchor,
  Bookmark,
  PageBuilder,
} from "@jasy/pdf";

const ink = "#1f2a37";
const brand = "#1450aa";
const muted = "#6b7280";
const hair = "#dfe4ee";

const chapters = [
  {
    id: "installation",
    title: "Installation",
    body:
      "Install the package with your usual package manager. jasy ships as pure ESM and needs no headless " +
      "browser, no Java runtime and no native binary, so a cold install is measured in seconds.",
  },
  {
    id: "authoring",
    title: "Authoring a document",
    body:
      "A document is a tree of components. Columns and rows stack, boxes frame, and text flows. When the " +
      "content outgrows a page, jasy paginates it for you and reprints the header and footer.",
  },
  {
    id: "shipping",
    title: "Shipping to production",
    body:
      "Render on a server, in a serverless function, or entirely in the browser - the engine is isomorphic. " +
      "Attach a ZUGFeRD invoice, tag the document for accessibility, or encrypt it with AES-256.",
  },
];

// One clickable row of the table of contents. The whole row is the hit area.
const tocRow = (n: number, id: string, title: string) =>
  Link(
    { to: id },
    Box({ padding: 8, borderBottom: hair }, [
      Row({ justify: "between" }, [
        Text(`${n}. ${title}`, { color: brand }),
        Text("jump", { color: muted, size: 10 }),
      ]),
    ]),
  );

const footer = PageBuilder(({ pageNumber, pageCount }) =>
  Column([
    Divider({ color: hair }),
    Box({ height: 6 }, []),
    Row({ justify: "between" }, [
      Text("jasy handbook", { size: 8.5, color: muted }),
      Text(`Page ${pageNumber} of ${pageCount}`, { size: 8.5, color: muted }),
    ]),
  ]),
);

// A chapter page: the heading is a Bookmark (sidebar) AND an Anchor (jump target) at once.
const chapter = (n: number, c: (typeof chapters)[number]) =>
  Page({ size: "A4", margin: 56, footer }, [
    Column({ gap: 12 }, [
      Bookmark(
        { title: `${n}. ${c.title}`, level: 1 },
        Anchor({ name: c.id }, Text(`${n}. ${c.title}`, { size: 22, bold: true, color: ink })),
      ),
      Paragraph(c.body),
      Paragraph([
        span("Read the full documentation at "),
        span("jasy.dev", { href: "https://jasy.dev", color: brand, bold: true }),
        span(", or return to the "),
        span("table of contents", { to: "contents", color: brand }),
        span("."),
      ]),
      Spacer(),
    ]),
  ]);

export default Document({ size: 11, color: ink, lineHeight: 1.5 }, [
  Page({ size: "A4", margin: 56, footer }, [
    Column({ gap: 16 }, [
      Bookmark(
        { title: "Contents", level: 1 },
        Anchor({ name: "contents" }, Text("Handbook", { size: 26, bold: true, color: brand })),
      ),
      Text("Every row below jumps to its chapter. The viewer's bookmark panel shows the same tree.", {
        color: muted,
      }),
      Box({ border: hair, radius: 6 }, [Column(chapters.map((c, i) => tocRow(i + 1, c.id, c.title)))]),
      Spacer(),
      Link(
        { href: "https://github.com/jasy-pdf/jasy" },
        Box({ bg: "#f4f6fb", padding: 12, radius: 6 }, [
          Text("The whole box is a link - opens the repository on GitHub.", {
            size: 10,
            color: brand,
          }),
        ]),
      ),
    ]),
  ]),
  ...chapters.map((c, i) => chapter(i + 1, c)),
]);
