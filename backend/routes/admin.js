import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const router = express.Router();

router.get("/stats", async (req, res) => {
  const db = await open({ filename: "./backend/data/jalsarathi.db", driver: sqlite3.Database });
  const rainCount = await db.get("SELECT COUNT(*) as count FROM rainwater_assessments");
  const testsCount = await db.get("SELECT COUNT(*) as count FROM water_quality_tests");
  const subsidiesCount = await db.get("SELECT COUNT(*) as count FROM subsidies");

  res.json({
    rainwaterRecords: rainCount.count,
    waterTests: testsCount.count,
    subsidies: subsidiesCount.count,
  });
});

export default router;
