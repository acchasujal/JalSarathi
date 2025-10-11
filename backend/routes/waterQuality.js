import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const router = express.Router();

// Example: Save water quality data
router.post("/submit", async (req, res) => {
  try {
    const { location, sampleDate, lead, arsenic, mercury } = req.body;
    const db = await open({ filename: "./backend/data/jalsarathi.db", driver: sqlite3.Database });

    await db.run(
      `INSERT INTO water_quality_tests (location, sampleDate, lead, arsenic, mercury)
       VALUES (?, ?, ?, ?, ?)`,
      [location, sampleDate, lead, arsenic, mercury]
    );

    res.json({ success: true, message: "Water quality test recorded." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to save test" });
  }
});

router.get("/all", async (req, res) => {
  const db = await open({ filename: "./backend/data/jalsarathi.db", driver: sqlite3.Database });
  const results = await db.all("SELECT * FROM water_quality_tests ORDER BY createdAt DESC");
  res.json(results);
});

export default router;
