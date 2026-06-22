import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// Landing copy lives as markdown under content/ so text can change without touching Vue.
// Sections are short front-matter-driven fragments queried by the page components.
export default defineContentConfig({
  collections: {
    // Landing copy (imprint, privacy, fragments) - everything except the docs tree.
    content: defineCollection({
      type: "page",
      source: { include: "**/*.md", exclude: ["docs/**"] },
      schema: z.object({
        headline: z.string().optional(),
      }),
    }),
    // The documentation tree under content/docs.
    docs: defineCollection({
      type: "page",
      source: "docs/**/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        navigation: z
          .object({
            title: z.string().optional(),
            icon: z.string().optional(),
          })
          .optional(),
      }),
    }),
  },
});
