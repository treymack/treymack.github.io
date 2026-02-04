import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Schema for dates - YAML parser may return Date or string depending on format
// We accept both but validate string format is yyyy-MM-dd
const dateSchema = z
  .union([
    z.date(),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in yyyy-MM-dd format")
      .transform((str) => new Date(str + "T00:00:00Z")),
  ])
  .refine((date) => !isNaN(date.getTime()), "Invalid date");

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: dateSchema,
      updatedDate: dateSchema.optional(),
      heroImage: image().optional(),
      categories: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
    }),
});

const about = defineCollection({
  // Load Markdown files in the `src/content/about/` directory.
  loader: glob({ base: "./src/content/about", pattern: "**/*.md" }),
  // No schema required - just load the markdown content
  schema: z.object({}),
});

export const collections = { blog, about };
