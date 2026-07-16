import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { walkId, name, email } = body;

    if (!walkId || !name || !email) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const walk = await prisma.walk.findUnique({
      where: {
        id: walkId,
      },
      include: {
        bookings: true,
      },
    });

    if (!walk) {
      return new Response(
        JSON.stringify({
          error: "Walk not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (walk.bookings.length >= walk.capacity) {
      return new Response(
        JSON.stringify({
          error: "Walk is fully booked",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        walk: {
          connect: {
            id: walkId,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        booking,
        seatsRemaining: walk.capacity - (walk.bookings.length + 1),
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Booking failed",
        details: error instanceof Error ? error.message : String(error),
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
