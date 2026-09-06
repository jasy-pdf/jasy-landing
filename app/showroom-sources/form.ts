// A form you can actually fill in the reader: seven kinds of AcroForm field, laid out like any other
// element. Open the PDF, type in it, tick a box, pick from the list - the values are stored in the
// file. The same library reads a form back and fills it programmatically.
import {
  Document,
  Page,
  Column,
  Row,
  Box,
  Text,
  Divider,
  Spacer,
  TextField,
  Checkbox,
  RadioGroup,
  Dropdown,
  ListBox,
  PushButton,
  SignatureField,
} from "@jasy/pdf";

const ink = "#0a2348";
const muted = "#6b7280";
const hair = "#dfe4ee";
const boxed = { border: "#aab3c2", background: "#fbfcfe" } as const;

// A label above its field - the pattern repeats, so it is a function rather than eleven copies.
const field = (label: string, control: ReturnType<typeof TextField>) =>
  Column({ gap: 4 }, [Text(label, { size: 8, color: muted }), control]);

export default Document({ size: 10, color: ink }, [
  Page({ size: "A4", margin: 52, gap: 16 }, [
    Row({ align: "center" }, [
      Column({ gap: 2 }, [
        Text("Membership application", { size: 20, bold: true }),
        Text("Fill this in on screen - no printer involved", { size: 9, color: muted }),
      ]),
      Spacer(),
      Text("F-2026-11", { size: 9, color: muted }),
    ]),

    Divider({ color: hair }),

    Row({ gap: 14 }, [
      field("Full name", TextField({ name: "fullName", width: 210, height: 22, ...boxed })),
      field("Date of birth", TextField({ name: "born", width: 110, height: 22, ...boxed })),
    ]),

    Row({ gap: 14 }, [
      field("Email", TextField({ name: "email", width: 210, height: 22, ...boxed })),
      field("Country", Dropdown({ name: "country", width: 110, height: 22, fontSize: 10, ...boxed }, ["DE", "AT", "CH"])),
    ]),

    field(
      "Anything we should know?",
      TextField({ name: "notes", width: 334, height: 56, multiline: true, maxLength: 500, ...boxed }),
    ),

    Row({ gap: 28, align: "start" }, [
      Column({ gap: 6 }, [
        Text("Membership", { size: 8, color: muted }),
        RadioGroup({ name: "plan", gap: 6, labelSize: 10 }, [
          { value: "basic", label: "Basic - 4 EUR a month" },
          { value: "pro", label: "Pro - 9 EUR a month" },
          { value: "team", label: "Team - 29 EUR a month" },
        ]),
      ]),
      Column({ gap: 6 }, [
        Text("Interests", { size: 8, color: muted }),
        ListBox({ name: "topics", width: 150, height: 60, fontSize: 10, ...boxed }, [
          "Invoicing",
          "Reports",
          "Typography",
          "Accessibility",
        ]),
      ]),
    ]),

    Checkbox({ name: "agree", label: "I have read the statutes", labelSize: 10 }),
    Checkbox({ name: "newsletter", label: "Send me the monthly letter", labelSize: 10 }),

    Divider({ color: hair }),

    Row({ gap: 20, align: "end" }, [
      field("Signature", SignatureField({ name: "signature", width: 210, height: 46, ...boxed })),
      Spacer(),
      PushButton({ name: "clear", label: "Reset form", action: "reset", width: 92, height: 26 }),
    ]),

    Spacer(),

    Box({ bg: "#f4f6f9", radius: 8, padding: 14 }, [
      Column({ gap: 5 }, [
        Text("And it reads them back", { size: 11, bold: true }),
        Text(
          "@jasy/pdf/edit opens a form somebody else made, reports its fields, fills them from a " +
            "plain object and can flatten the result. The save is an incremental update, so the " +
            "original file stays a literal prefix of the new one - nothing is rewritten behind " +
            "your back.",
          { size: 9, color: muted, lineHeight: 1.45 },
        ),
      ]),
    ]),
  ]),
]);
