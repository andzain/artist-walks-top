import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { prisma } from "../lib/prisma";
import { notifyGuideOfBooking, confirmBookingToCustomer } from "../lib/mailer";

export const server = {
  createBooking: defineAction({
    accept: "json",
    input: z.object({
      walkId: z.string(),
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(6),
      experienceTitle: z.string(),
      meetingPoint: z.string(),
    }),
    handler: async (input) => {
      const booking = await prisma.$transaction(async (tx) => {
        const walk = await tx.walk.findUnique({
          where: { id: input.walkId },
        });

        if (!walk) throw new Error("This date no longer exists");

        const bookedCount = await tx.booking.count({
          where: { walkId: walk.id },
        });

        if (bookedCount >= walk.capacity) {
          throw new Error("This date is fully booked");
        }

        const created = await tx.booking.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            walkId: walk.id,
          },
        });

        return { created, walk };
      });

      try {
        await notifyGuideOfBooking({
          name: input.name,
          email: input.email,
          phone: input.phone,
          experienceSlug: booking.walk.experienceSlug,
          startsAt: booking.walk.startsAt,
        });
      } catch (err) {
        console.error("Guide notification failed:", err);
      }

      try {
        await confirmBookingToCustomer({
          name: input.name,
          email: input.email,
          experienceTitle: input.experienceTitle,
          startsAt: booking.walk.startsAt,
          meetingPoint: input.meetingPoint,
        });
      } catch (err) {
        console.error("Customer confirmation failed:", err);
      }

      return booking.created;
    },
  }),
};
