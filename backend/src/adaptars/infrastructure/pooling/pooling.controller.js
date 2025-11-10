import express from "express";
import { PoolingService } from "../../../core/application/poolingService.js";

const router = express.Router();
const poolingService = new PoolingService();

// GET /compliance/adjusted-cb?year=YYYY
router.get("/compliance/adjusted-cb", async (req, res) => {
  try {
    const { year } = req.query;
    const data = await poolingService.getAdjustedCB(Number(year));
    res.json(data|| []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /pools
router.post("/pools", async (req, res) => {
  try {
    const { members } = req.body;
    const pool = await poolingService.createPool(members);
    res.json(pool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
