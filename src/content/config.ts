import { defineCollection, z } from "astro:content";

const experiences = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    duration: z.string(),
    meetingPoint: z.string(),
    pricing: z.object({
      group: z.number(),
      private: z.number(),
      fullDay: z.number().optional(),
    }),
    languages: z.array(z.string()),
    difficulty: z.string(),
    featured: z.boolean().optional(),
    hero: z.string(),
    gallery: z.array(z.string()).optional(),
    order: z.number(),
    calEvent: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const collectionsCollection = defineCollection({
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
  collections: collectionsCollection,
};
