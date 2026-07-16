import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = Object.fromEntries(request.headers.entries());
  const body = await request.text();

  return new Response(
    JSON.stringify({
      headers,
      body,
      length: body.length,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
