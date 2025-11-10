import { prisma } from "../../shared/db.js";

export class PoolingService {
  async getAdjustedCB(year) {
    const yearNum = parseInt(year);
    return await prisma.ship.findMany({
      where: { year },
      select: { id: true, name: true, adjustedCB: true },
    });
  }

  async createPool(members) {
    const ships = await prisma.ship.findMany({
      where: { id: { in: members } },
      select: { id: true, adjustedCB: true },
    });

    const total = ships.reduce((sum, s) => sum + s.adjustedCB, 0);

    if (total < 0) {
      throw new Error("Invalid pool: total adjusted CB must be ≥ 0");
    }

    for (const s of ships) {
      if (s.adjustedCB < 0 && total < Math.abs(s.adjustedCB)) {
        throw new Error(`Ship ${s.id} deficit worsens — not allowed`);
      }
      if (s.adjustedCB > 0 && total < 0) {
        throw new Error(`Ship ${s.id} surplus cannot become negative`);
      }
    }

    const pool = await prisma.pool.create({
      data: {
        totalCB: total,
        members: {
          connect: members.map((id) => ({ id })),
        },
      },
      include: { members: true },
    });

    return pool;
  }
}
