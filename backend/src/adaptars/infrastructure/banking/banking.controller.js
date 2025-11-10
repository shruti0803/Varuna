import express from "express";
import { BankingService } from "../../../core/application/bankingService.js";

const router = express.Router();
const bankingService = new BankingService();

// GET /banking/records?shipId=ABC&year=2025
router.get("/records", async (req, res) => {
  try {
    const { shipId, year } = req.query;
    const records = await bankingService.getRecords(shipId, year);
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
    const record = await bankingService.bankSurplus(shipId, year, amount);
    res.json(record);
  } catch (err) {
    console.error("Error banking surplus:", err);
    res.status(400).json({ error: err.message });
  }
});

// POST /banking/apply
router.post("/apply", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    const result = await bankingService.applyBanked(shipId, year, amount);
    res.json(result);
  } catch (err) {
    console.error("Error applying banked surplus:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
