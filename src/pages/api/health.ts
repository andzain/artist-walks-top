import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return new Response(
      JSON.stringify({
        status: "ok",
        database: "connected",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("FULL ERROR:", error);

    return new Response(
      JSON.stringify(
        {
          status: "error",
          database: "disconnected",
          error,
        },
        null,
        2,
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
