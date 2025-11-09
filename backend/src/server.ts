import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Test route
app.get("/", (req, res) => {
  res.send("Fuel EU Compliance Backend is running!");
});

// DB test route
app.get("/test-db", async (req, res) => {
  try {
    // This will ping the database
    await prisma.$connect();
    await prisma.$disconnect(); // optional, just for test
    res.json({ connected: true, message: "Database connection successful ✅" });
  } catch (err) {
    res.status(500).json({ connected: false, error: (err as Error).message });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected ✅");
  } catch (err) {
    console.error("Database connection failed ❌", (err as Error).message);
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
