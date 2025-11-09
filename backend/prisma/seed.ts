import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional, safe for dev)
  await prisma.route.deleteMany();

  // Seed initial routes (one baseline, rest comparisons)
  await prisma.route.createMany({
    data: [
      {
        route_id: "R001",
        vesselType: "Tanker",
        fuelType: "HFO",
        year: 2025,
        ghg_intensity: 91.16,
        fuelConsumption: 1200,
        distance: 5000,
        totalEmissions: 45000,
        is_baseline: true,
      },
      {
        route_id: "R002",
        vesselType: "Tanker",
        fuelType: "LNG",
        year: 2025,
        ghg_intensity: 87.5,
        fuelConsumption: 1100,
        distance: 5200,
        totalEmissions: 41000,
      },
      {
        route_id: "R003",
        vesselType: "Container",
        fuelType: "MGO",
        year: 2025,
        ghg_intensity: 90.3,
        fuelConsumption: 900,
        distance: 4800,
        totalEmissions: 39500,
      },
      {
        route_id: "R004",
        vesselType: "Bulk",
        fuelType: "HFO",
        year: 2025,
        ghg_intensity: 92.8,
        fuelConsumption: 1300,
        distance: 5500,
        totalEmissions: 47500,
      },
      {
        route_id: "R005",
        vesselType: "RoRo",
        fuelType: "Biofuel",
        year: 2025,
        ghg_intensity: 85.7,
        fuelConsumption: 1000,
        distance: 4900,
        totalEmissions: 40500,
      },
    ],
  });

  console.log("✅ Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
