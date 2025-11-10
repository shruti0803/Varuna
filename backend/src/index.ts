import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import bankingController from "./adaptars/infrastructure/banking/banking.controller.js";
import poolingController from "./adaptars/infrastructure/pooling/pooling.controller.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/banking", bankingController);
app.use("/api", poolingController);

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("Fuel EU Backend running ✅");
});

// --- GET ALL ROUTES ---
app.get("/routes", async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// --- SET BASELINE ROUTE ---
app.post("/routes/:id/baseline", async (req, res) => {
  const { id } = req.params;
  try {
    // Reset all routes baseline flag
    await prisma.route.updateMany({ data: { is_baseline: false } });

    // Set the selected route as baseline
    const updated = await prisma.route.update({
      where: { id: Number(id) },
      data: { is_baseline: true },
    });

    res.json({ message: "Baseline updated", route: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set baseline" });
  }
});

// --- ROUTE COMPARISON ---
app.get("/routes/comparison", async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    const baseline = routes.find(r => r.is_baseline);

    if (!baseline) {
      return res.status(400).json({ error: "No baseline route found" });
    }

    const comparisons = routes.map(r => {
      const percentDiff = ((r.ghg_intensity - baseline.ghg_intensity) / baseline.ghg_intensity) * 100;
      const compliant = r.ghg_intensity <= baseline.ghg_intensity;

      return {
        ...r,
        percentDiff: parseFloat(percentDiff.toFixed(2)),
        compliant
      };
    });

    res.json({
      baseline: baseline.id,
      comparisons
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute route comparisons" });
  }
});

// --- SHIP COMPLIANCE / ADJUSTED CB ---
app.get("/api/compliance/adjusted-cb", async (req, res) => {
  try {
    const year = Number(req.query.year);
    if (!year) return res.status(400).json({ error: "Year is required" });

    const adjustedCBs = await prisma.shipCompliance.findMany({
      where: { year },
    });

    res.json(adjustedCBs || []);
  } catch (err) {
    console.error("Error fetching adjusted CBs:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
