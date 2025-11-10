import prisma from "../../shared/db.js";

export class PoolingService {
  async getAdjustedCB(year) {
    const yearNum = parseInt(year);
    console.log("Fetching adjusted CB for year:", yearNum);

    const result = await prisma.shipCompliance.findMany({
      where: { year: yearNum },
      select: { id: true, ship_id: true, cb_gco2eq: true },
    });

    console.log("Adjusted CB records fetched:", result);
    return result;
  }

  async createPool(members) {
    console.log("Creating pool with members:", members);

    const ships = await prisma.shipCompliance.findMany({
      where: { id: { in: members } },
      select: { id: true, ship_id: true, cb_gco2eq: true },
    });

    console.log("Ships fetched for pooling:", ships);

    const total = ships.reduce((sum, s) => sum + s.cb_gco2eq, 0);
    console.log("Total CB sum for pool:", total);

    if (total < 0) {
      throw new Error("Invalid pool: total adjusted CB must be ≥ 0");
    }

    const pool = await prisma.pool.create({
      data: {
        year: new Date().getFullYear(),
        members: {
          create: ships.map((s) => ({
            ship_id: s.ship_id,
            cb_before: s.cb_gco2eq,
            cb_after: s.cb_gco2eq,
          })),
        },
      },
      include: { members: true },
    });

    console.log("Pool created successfully:", pool);
    return pool;
  }
}
