import express from "express";
import { jalsarathiDB } from "../config/database.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const rainCount = await new Promise((res, rej) => jalsarathiDB.db.get("SELECT COUNT(*) as count FROM rainwater_assessments", (err, row) => err ? rej(err) : res(row)));
    const testsCount = await new Promise((res, rej) => jalsarathiDB.db.get("SELECT COUNT(*) as count FROM water_quality_tests", (err, row) => err ? rej(err) : res(row)));
    const subsidiesCount = await new Promise((res, rej) => jalsarathiDB.db.get("SELECT COUNT(*) as count FROM subsidies", (err, row) => err ? rej(err) : res(row)));

    res.json({
      rainwaterRecords: rainCount?.count || 0,
      waterTests: testsCount?.count || 0,
      subsidies: subsidiesCount?.count || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// VENDORS CRUD
router.get("/vendors", (req, res) => {
  jalsarathiDB.db.all("SELECT * FROM vendors", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/vendors", (req, res) => {
  const { name, city, phone, rating } = req.body;
  const stmt = "INSERT INTO vendors (name, city, phone, rating) VALUES (?, ?, ?, ?)";
  jalsarathiDB.db.run(stmt, [name, city, phone, rating], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, city, phone, rating });
  });
});

router.delete("/vendors/:id", (req, res) => {
  jalsarathiDB.db.run("DELETE FROM vendors WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

// LOCATIONS CRUD
router.get("/locations", (req, res) => {
  jalsarathiDB.db.all("SELECT * FROM locations", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/locations", (req, res) => {
  const { name, rainfall, type } = req.body;
  const stmt = "INSERT INTO locations (name, rainfall, type) VALUES (?, ?, ?)";
  jalsarathiDB.db.run(stmt, [name, rainfall, type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, rainfall, type });
  });
});

router.delete("/locations/:id", (req, res) => {
  jalsarathiDB.db.run("DELETE FROM locations WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

export default router;
