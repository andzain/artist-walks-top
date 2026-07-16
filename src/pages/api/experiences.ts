import { getCollection } from "astro:content";

export async function GET() {
  const experiences = await getCollection("experiences");

  return Response.json(
    experiences.map((e) => ({
      id: e.id,
      title: e.data.title,
      slug: e.data.experienceSlug,
    })),
  );
}
