import { prisma } from "../src/lib/prisma";

const EXPERIENCE_SLUGS = [
  "soviet-modernism",
  "master-plan",
  "power-protest-privilege",
  "everyday-yerevan",
];

const DEFAULT_CAPACITY = 8; // <-- change if wrong
const DAYS_AHEAD = 90;

function getTimesForDate(date: Date): string[] {
  const month = date.getMonth() + 1; // 1-12
  const isSummer = month >= 6 && month <= 9; // <-- change if wrong
  return isSummer ? ["09:00", "17:00"] : ["10:00", "15:00"];
}

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    const times = getTimesForDate(day);

    for (const slug of EXPERIENCE_SLUGS) {
      for (const time of times) {
        const [hours, minutes] = time.split(":").map(Number);
        const startsAt = new Date(day);
        startsAt.setHours(hours, minutes, 0, 0);

        const existing = await prisma.walk.findFirst({
          where: { experienceSlug: slug, startsAt },
        });

        if (!existing) {
          await prisma.walk.create({
            data: {
              experienceSlug: slug,
              startsAt,
              capacity: DEFAULT_CAPACITY,
            },
          });
        }
      }
    }
  }
  console.log("Done generating walks.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
