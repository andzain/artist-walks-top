import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXPERIENCE_SLUGS = [
  "soviet-modernism",
  "master-plan",
  "power-protest-privilege",
  "everyday-yerevan",
];

const CAPACITY = 8;

async function main() {
  const year = new Date().getFullYear();

  const summerStart = new Date(year, 5, 1); // June 1
  const summerEnd = new Date(year, 8, 30); // Sep 30
  const autumnStart = new Date(year, 9, 1); // Oct 1

  for (const slug of EXPERIENCE_SLUGS) {
    for (let dow = 0; dow <= 6; dow++) {
      // Summer: 09:00 and 17:00
      await prisma.availabilityRule.createMany({
        data: [
          {
            experienceSlug: slug,
            dayOfWeek: dow,
            time: "09:00",
            capacity: CAPACITY,
            validFrom: summerStart,
            validTo: summerEnd,
          },
          {
            experienceSlug: slug,
            dayOfWeek: dow,
            time: "17:00",
            capacity: CAPACITY,
            validFrom: summerStart,
            validTo: summerEnd,
          },
          // Autumn/rest: 10:00 and 15:00
          {
            experienceSlug: slug,
            dayOfWeek: dow,
            time: "10:00",
            capacity: CAPACITY,
            validFrom: autumnStart,
            validTo: null,
          },
          {
            experienceSlug: slug,
            dayOfWeek: dow,
            time: "15:00",
            capacity: CAPACITY,
            validFrom: autumnStart,
            validTo: null,
          },
        ],
      });
    }
  }

  console.log("Seeded availability rules.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
