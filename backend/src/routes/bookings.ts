import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { bookingSchema } from "../schemas/booking";

export async function bookingRoutes(app: FastifyInstance) {
  app.post("/bookings", async (request, reply) => {
    // Validate the incoming request
    const result = bookingSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid request",
        details: result.error.flatten(),
      });
    }

    // Check if the walk exists
    const walk = await prisma.walk.findUnique({
      where: {
        id: result.data.walkId,
      },
    });

    if (!walk) {
      return reply.status(404).send({
        error: "Walk not found",
      });
    }

    // Count existing bookings
    const bookingCount = await prisma.booking.count({
      where: {
        walkId: walk.id,
      },
    });

    // Prevent overbooking
    if (bookingCount >= walk.capacity) {
      return reply.status(400).send({
        error: "Walk is fully booked",
      });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: result.data,
    });

    // Return booking and remaining seats
    return {
      booking,
      seatsRemaining: walk.capacity - (bookingCount + 1),
    };
  });
}
