import express from "express";
import { jalsarathiDB } from "../config/database.js";

const router = express.Router();

router.post("/calculate", async (req, res) => {
  try {
    let { location, lead, arsenic, mercury } = req.body;
    
    // Convert to float
    lead = parseFloat(lead) || 0;
    arsenic = parseFloat(arsenic) || 0;
    mercury = parseFloat(mercury) || 0;

    // Standard limits (mg/L)
    const standards = { lead: 0.01, arsenic: 0.01, mercury: 0.001 };
    
    // Weights (1 / standard) // using simplistic HPI method
    const weights = {
      lead: 1 / standards.lead,
      arsenic: 1 / standards.arsenic,
      mercury: 1 / standards.mercury
    };

    const sumWeights = weights.lead + weights.arsenic + weights.mercury;

    // Sub-indices Q_i = (M_i / S_i) * 100
    const q = {
      lead: (lead / standards.lead) * 100,
      arsenic: (arsenic / standards.arsenic) * 100,
      mercury: (mercury / standards.mercury) * 100
    };

    const hpi = ((q.lead * weights.lead) + (q.arsenic * weights.arsenic) + (q.mercury * weights.mercury)) / sumWeights;

    let safety_level = "Excellent";
    if (hpi > 100) safety_level = "Unsafe";
    else if (hpi > 50) safety_level = "Poor";
    else if (hpi > 25) safety_level = "Good";

    // Save to DB
    const query = `
      INSERT INTO water_quality_tests (
        location, lead_concentration, arsenic_concentration, mercury_concentration, hpi_score, safety_level
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const resultId = await new Promise((resolve, reject) => {
      jalsarathiDB.db.run(query, [location || 'Unknown', lead, arsenic, mercury, hpi.toFixed(2), safety_level], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    res.json({
      success: true,
      data: {
        id: resultId,
        location: location || 'Unknown',
        hpi: parseFloat(hpi.toFixed(2)),
        safety_level,
        parameters: { lead, arsenic, mercury }
      }
    });

  } catch (err) {
    console.error("HPI Calc Error:", err);
    res.status(500).json({ success: false, error: "Failed to process water quality test" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const results = await new Promise((resolve, reject) => {
      jalsarathiDB.db.all("SELECT * FROM water_quality_tests ORDER BY created_at DESC LIMIT 50", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json(results);
  } catch (err) {
    console.error("Fetch DB Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch quality tests" });
  }
});

export default router;
