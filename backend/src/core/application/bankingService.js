import { prisma } from "../../shared/db.js";

export class BankingService {
  async getRecords(shipId, year) {
    const where = {};
    if (shipId) where.shipId = shipId;
    if (year) where.year = parseInt(year);
    return prisma.bankingRecord.findMany({ where, orderBy: { year: "desc" } });
  }

  async bankSurplus(shipId, year, amount) {
    if (amount <= 0) throw new Error("Invalid amount");
    return prisma.bankingRecord.create({
      data: { shipId, year: parseInt(year), amount, type: "CREDIT" },
    });
  }

  async applyBanked(shipId, year, amount) {
    const totalAvailable = await prisma.bankingRecord.aggregate({
      _sum: { amount: true },
      where: { shipId, type: "CREDIT" },
    });

    const applied = await prisma.bankingRecord.aggregate({
      _sum: { amount: true },
      where: { shipId, type: "DEBIT" },
    });

    const available = (totalAvailable._sum.amount || 0) - (applied._sum.amount || 0);
    if (amount > available) throw new Error("Not enough banked surplus");

    return prisma.bankingRecord.create({
      data: { shipId, year: parseInt(year), amount, type: "DEBIT" },
    });
  }
}
