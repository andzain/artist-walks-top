import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DAYS_AHEAD = 90;

async function main() {
  const rules = await prisma.availabilityRule.findMany({
    where: { active: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let created = 0;

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    const dow = day.getDay();

    for (const rule of rules) {
      if (rule.dayOfWeek !== dow) continue;
      if (day < rule.validFrom) continue;
      if (rule.validTo && day > rule.validTo) continue;

      const [hours, minutes] = rule.time.split(":").map(Number);
      const startsAt = new Date(day);
      startsAt.setHours(hours, minutes, 0, 0);

      const existing = await prisma.walk.findFirst({
        where: { experienceSlug: rule.experienceSlug, startsAt },
      });

      if (!existing) {
        await prisma.walk.create({
          data: {
            experienceSlug: rule.experienceSlug,
            startsAt,
            capacity: rule.capacity,
          },
        });
        created++;
      }
    }
  }

  console.log(`Created ${created} walks.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
