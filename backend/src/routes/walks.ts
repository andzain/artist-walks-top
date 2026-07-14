import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function walkRoutes(app: FastifyInstance) {
  app.get("/walks", async () => {
    return prisma.walk.findMany({
      orderBy: {
        startsAt: "asc",
      },
    });
  });

  app.post("/walks", async (request) => {
    const body = request.body as {
      experienceSlug: string;
      startsAt: string;
      capacity: number;
    };

    return prisma.walk.create({
      data: {
        experienceSlug: body.experienceSlug,
        startsAt: new Date(body.startsAt),
        capacity: body.capacity,
      },
    });
  });
}
