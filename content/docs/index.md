---
title: Introduction
description: jasy is a pure-TypeScript toolkit for generating PDFs and ZUGFeRD / XRechnung e-invoices.
navigation:
  title: Introduction
---

# jasy

The name is short for **ja**vaScript ea**sy** PDF, and that is the whole goal: a pure-TypeScript
toolkit for building PDFs, and the first Node library that handles ZUGFeRD and XRechnung e-invoices
end to end - generate, validate and read. No Java, no headless browser, no upload. Your data never
leaves your machine.

## The packages

| Package         | What it does                                                            |
| --------------- | ----------------------------------------------------------------------- |
| `@jasy/pdf`     | the declarative, Flutter-style PDF engine                               |
| `@jasy/vue`     | author PDFs as Vue components, rendered in the browser or on a server   |
| `@jasy/nuxt`    | the Nuxt module: zero-config PDFs on the client or a server route       |
| `@jasy/zugferd` | ZUGFeRD / XRechnung: your data to a conformant PDF/A-3 and EN-16931 XML |
| `@jasy/cli`     | the `jasy` terminal: read, validate and export invoices                 |

## Install

Pick the package for what you want to do. jasy is in early alpha, so install with the `@alpha` tag for
now.

```bash
pnpm add @jasy/pdf@alpha       # build PDFs
pnpm add @jasy/vue@alpha vue    # author PDFs as Vue components
npx nuxi module add @jasy/nuxt  # the Nuxt module
pnpm add @jasy/zugferd@alpha   # build e-invoices (pulls @jasy/pdf in for you)
pnpm add -g @jasy/cli@alpha    # the command-line tool
```

## Where to next

- [**Creating PDFs**](/docs/pdf) - the engine, from a one-line hello to full layouts.
- [**PDFs in Vue**](/docs/vue) - author documents as Vue components, rendered in the browser.
- [**PDFs in Nuxt**](/docs/nuxt) - the zero-config module, client or server.
- **E-invoices** - generate and validate ZUGFeRD / XRechnung. Its own chapter.
- [**The CLI**](/docs/cli) - read, validate and export any invoice from your terminal.
