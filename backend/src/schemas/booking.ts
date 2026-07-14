import { z } from "zod";

export const bookingSchema = z.object({
  walkId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
