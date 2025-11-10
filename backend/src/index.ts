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

// ✅ Allow frontend requests
app.use(cors({
  origin: "http://localhost:5173", // your React app URL
  credentials: true,
}));
app.use("/banking", bankingController);
// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("Fuel EU Backend running ✅");
});

// --- ROUTES API ---
app.get("/routes", async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

app.use("/api", poolingController);

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
      baseline: baseline.route_id,
      comparisons
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute route comparisons" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});