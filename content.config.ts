import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// Landing copy lives as markdown under content/ so text can change without touching Vue.
// Sections are short front-matter-driven fragments queried by the page components.
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
      schema: z.object({
        headline: z.string().optional(),
      }),
    }),
  },
});
