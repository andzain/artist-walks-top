import { prisma } from "../lib/prisma";

const EXPERIENCE_SLUGS = [
  "soviet-modernism",
  "master-plan",
  "power-protest-privilege",
  "everyday-yerevan",
];

const DEFAULT_CAPACITY = 8; // <-- change if wrong
const SUMMER_START = new Date(new Date().getFullYear(), 5, 1); // Jun 1 — change if wrong
const SUMMER_END = new Date(new Date().getFullYear(), 8, 30); // Sep 30 — change if wrong

async function main() {
  for (const slug of EXPERIENCE_SLUGS) {
    for (let dow = 0; dow <= 6; dow++) {
      // Summer rule
      await prisma.availabilityRule.create({
        data: {
          experienceSlug: slug,
          dayOfWeek: dow,
          time: "09:00",
          capacity: DEFAULT_CAPACITY,
          validFrom: SUMMER_START,
          validTo: SUMMER_END,
        },
      });
      await prisma.availabilityRule.create({
        data: {
          experienceSlug: slug,
          dayOfWeek: dow,
          time: "17:00",
          capacity: DEFAULT_CAPACITY,
          validFrom: SUMMER_START,
          validTo: SUMMER_END,
        },
      });
      // Rest-of-year rule (starts day after summer ends)
      const restStart = new Date(SUMMER_END);
      restStart.setDate(restStart.getDate() + 1);
      await prisma.availabilityRule.create({
        data: {
          experienceSlug: slug,
          dayOfWeek: dow,
          time: "10:00",
          capacity: DEFAULT_CAPACITY,
          validFrom: restStart,
          validTo: null,
        },
      });
      await prisma.availabilityRule.create({
        data: {
          experienceSlug: slug,
          dayOfWeek: dow,
          time: "15:00",
          capacity: DEFAULT_CAPACITY,
          validFrom: restStart,
          validTo: null,
        },
      });
    }
  }
  console.log("Seeded availability rules.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
