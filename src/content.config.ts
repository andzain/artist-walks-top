import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const experiences = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/experiences",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    duration: z.string(),
    meetingPoint: z.string(),

    pricing: z.object({
      group: z.number(),
      private: z.number(),
      fullDay: z.number(),
    }),

    languages: z.array(z.string()),
    difficulty: z.string(),

    featured: z.boolean(),

    calEvent: z.string(),

    hero: z.string(),

    gallery: z.array(z.string()),

    order: z.number(),

    tags: z.array(z.string()),
  }),
});

const collectionsContent = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/collections",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),

    hero: z.string(),

    featured: z.boolean().default(false),

    order: z.number().default(0),

    relatedExperience: z.string(),

    themes: z.array(z.string()),

    gallery: z.array(z.string()).default([]),
  }),
});

export const collections = {
  experiences,
  collections: collectionsContent,
};
