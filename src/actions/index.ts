import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { prisma } from "../lib/prisma";
import { notifyGuideOfBooking } from "../lib/mailer";

export const server = {
  createBooking: defineAction({
    accept: "json",
    input: z.object({
      walkId: z.string(),
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(6),
    }),
    handler: async (input) => {
      const booking = await prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<
          {
            id: string;
            capacity: number;
            experienceSlug: string;
            startsAt: Date;
          }[]
        >`
          SELECT id, capacity, "experienceSlug", "startsAt" FROM "Walk" WHERE id = ${input.walkId} FOR UPDATE
        `;
        const walk = rows[0];
        if (!walk) throw new Error("This date no longer exists");

        const bookedCount = await tx.booking.count({
          where: { walkId: walk.id },
        });
        if (bookedCount >= walk.capacity)
          throw new Error("This date is fully booked");

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
        console.error("Booking succeeded but email notification failed:", err);
      }

      return booking.created;
    },
  }),
};
