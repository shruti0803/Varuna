import express from "express";
import  prisma  from "../../../shared/db.js"; // prisma client

const router = express.Router();

// GET /banking/records?shipId=ABC&year=2025
router.get("/records", async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

    const records = await prisma.bankingRecord.findMany({
      where: { shipId, year: Number(year) },
      orderBy: { createdAt: "desc" },
    });

    res.json(records);
  } catch (err) {
    console.error("Error fetching banking records:", err);
    res.status(500).json({ error: "Failed to fetch banking records" });
  }
});

// POST /banking/bank
router.post("/bank", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) return res.status(400).json({ error: "Missing data" });

    const record = await prisma.bankingRecord.create({
      data: {
        shipId,
        year: Number(year),
        amount: Number(amount),
        type: "CREDIT",
      },
    });

    res.json(record);
  } catch (err) {
    console.error("Error banking surplus:", err);
    res.status(500).json({ error: "Failed to bank surplus" });
  }
});

// POST /banking/apply
router.post("/apply", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) return res.status(400).json({ error: "Missing data" });

    // Apply only up to available banked surplus
    const bankedRecords = await prisma.bankingRecord.findMany({
      where: { shipId, year: Number(year), type: "CREDIT" },
      orderBy: { createdAt: "asc" },
    });

    let remaining = Number(amount);
    let appliedTotal = 0;

    for (const rec of bankedRecords) {
      if (remaining <= 0) break;
      const applyAmount = Math.min(rec.amount, remaining);

      // Create a DEBIT record
      await prisma.bankingRecord.create({
        data: {
          shipId,
          year: Number(year),
          amount: applyAmount,
          type: "DEBIT",
        },
      });

      remaining -= applyAmount;
      appliedTotal += applyAmount;
    }

    res.json({ applied: appliedTotal });
  } catch (err) {
    console.error("Error applying banked surplus:", err);
    res.status(500).json({ error: "Failed to apply banked surplus" });
  }
});

export default router;
