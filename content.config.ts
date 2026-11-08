import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// Landing copy lives as markdown under content/ so text can change without touching Vue.
// Sections are short front-matter-driven fragments queried by the page components.
const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  navigation: z
    .object({
      title: z.string().optional(),
      icon: z.string().optional(),
    })
    .optional(),
});

export default defineContentConfig({
  collections: {
    // Landing copy (imprint, privacy, fragments) - everything except the docs tree.
    content: defineCollection({
      type: "page",
      source: { include: "**/*.md", exclude: ["docs/**", "de/**"] },
      schema: z.object({
        headline: z.string().optional(),
      }),
    }),
    // The documentation tree: English under content/docs, translations under content/<locale>/docs with
    // the same file names and the same paths (/docs/...); the page adds the /de prefix. A page without a
    // translation shows the English one, marked - see pages/docs/[...slug].vue.
    docs: defineCollection({
      type: "page",
      source: "docs/**/*.md",
      schema: docsSchema,
    }),
    docs_de: defineCollection({
      type: "page",
      source: { include: "de/docs/**/*.md", prefix: "/docs" },
      schema: docsSchema,
    }),
  },
});
