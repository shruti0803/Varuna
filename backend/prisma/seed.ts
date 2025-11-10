import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing routes (optional during dev)
  await prisma.route.deleteMany();

  // Seed initial routes
  await prisma.route.createMany({
    data: [
      { route_id: "R1", year: 2025, ghg_intensity: 89.3368, is_baseline: true },
      { route_id: "R2", year: 2025, ghg_intensity: 92.1, is_baseline: false },
      { route_id: "R3", year: 2025, ghg_intensity: 85.9, is_baseline: false },
      { route_id: "R4", year: 2025, ghg_intensity: 88.5, is_baseline: false },
      { route_id: "R5", year: 2025, ghg_intensity: 90.7, is_baseline: false },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
