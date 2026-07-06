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

    calEvent: z.string().optional(),
    calLink: z.string().optional(),

    hero: z.string(),
    gallery: z.array(z.string()).default([]),

    order: z.number().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  experiences,
};
