import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async () => {
  try {
    const walks = await prisma.walk.findMany({
      orderBy: {
        startsAt: "asc",
      },
      include: {
        bookings: true,
      },
    });

    return new Response(JSON.stringify(walks), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Failed to load walks",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
