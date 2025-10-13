// backend/routes/rainwater.js
import express from "express";
import { calculateRainwaterHarvesting } from "../services/rainwaterservice.js"; // ✅ lowercase file name
import { generateRainwaterPDF } from "../utils/pdfGenerator.js"; // optional
import { jalsarathiDB } from "../config/database.js";

const router = express.Router();

/* -----------------------------------------------------------------------
 *  Hardcoded Indian City Data (No IMD API)
 * ----------------------------------------------------------------------*/
const demoLocations = [
  { id: 1, name: "Delhi", rainfall: 800, type: "urban" },
  { id: 2, name: "Mumbai", rainfall: 2200, type: "urban" },
  { id: 3, name: "Chennai", rainfall: 1400, type: "urban" },
  { id: 4, name: "Bengaluru", rainfall: 970, type: "urban" },
  { id: 5, name: "Kolkata", rainfall: 1800, type: "urban" },
  { id: 6, name: "Jaipur", rainfall: 650, type: "semi-arid" },
  { id: 7, name: "Hyderabad", rainfall: 900, type: "urban" },
  { id: 8, name: "Pune", rainfall: 1100, type: "urban" },
  { id: 9, name: "Dehradun", rainfall: 2100, type: "rural" },
  { id: 10, name: "Shimla", rainfall: 1500, type: "rural" },
  { id: 11, name: "Ahmedabad", rainfall: 800, type: "urban" },
  { id: 12, name: "Lucknow", rainfall: 1000, type: "urban" },
  { id: 13, name: "Indore", rainfall: 1050, type: "urban" },
  { id: 14, name: "Kochi", rainfall: 3100, type: "urban" },
  { id: 15, name: "Visakhapatnam", rainfall: 950, type: "urban" },
];

/* -----------------------------------------------------------------------
 *  GET /api/rainwater/demo-locations
 *  Returns hardcoded demo Indian cities
 * ----------------------------------------------------------------------*/
router.get("/demo-locations", (req, res) => {
  const { type, name } = req.query;
  let filtered = demoLocations;

  if (type) filtered = filtered.filter((l) => l.type === type.toLowerCase());
  if (name)
    filtered = filtered.filter((l) =>
      l.name.toLowerCase().includes(name.toLowerCase())
    );

  res.json(filtered);
});

/* -----------------------------------------------------------------------
 *  POST /api/rainwater/calculate
 *  Calculates rainwater harvesting potential
 * ----------------------------------------------------------------------*/
router.post("/calculate", async (req, res) => {
  try {
    const {
      location,
      rooftopArea,
      buildingType,
      householdMembers,
      locationType,
    } = req.body;

    if (!location || !rooftopArea || !buildingType) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: location, rooftopArea, buildingType",
      });
    }

    // Find rainfall for selected location from demo data
    const locationData = demoLocations.find(
      (l) => l.name.toLowerCase() === location.toLowerCase()
    );
    const rainfall = locationData ? locationData.rainfall : 1000; // fallback

    const cleanData = {
      location,
      rooftopArea: parseFloat(rooftopArea),
      buildingType,
      householdMembers: parseInt(householdMembers) || 4,
      locationType: locationType || "urban",
      rainfall,
    };

    // Perform calculation
    const result = await calculateRainwaterHarvesting(cleanData);

    // Optional DB save (non-blocking)
    try {
      const insertQuery = `
        INSERT INTO rainwater_assessments 
          (location, rooftop_area, building_type, household_members, location_type, rainfall_mm, harvestable_water, annual_savings, system_cost, payback_period)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      jalsarathiDB.db.run(
        insertQuery,
        [
          cleanData.location,
          cleanData.rooftopArea,
          cleanData.buildingType,
          cleanData.householdMembers,
          cleanData.locationType,
          result.rainfall,
          result.harvestableWater,
          result.annualSavings,
          result.systemCost,
          result.paybackPeriod,
        ],
        function (err) {
          if (err) {
            console.error("❌ DB insert failed:", err.message);
          } else {
            console.log(`✅ Rainwater record saved (rowid ${this.lastID})`);
          }
        }
      );
    } catch (dbErr) {
      console.warn("⚠️ Database save skipped:", dbErr.message);
    }

    return res.json({
      success: true,
      message: "Rainwater harvesting potential calculated successfully",
      data: result,
    });
  } catch (error) {
    console.error("💥 Calculation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to calculate rainwater potential",
      details: error.message,
    });
  }
});

/* -----------------------------------------------------------------------
 *  POST /api/rainwater/generate-pdf
 *  Generates downloadable PDF report
 * ----------------------------------------------------------------------*/
router.post("/generate-pdf", async (req, res) => {
  try {
    const { assessmentData } = req.body;
    if (!assessmentData) {
      return res.status(400).json({ error: "Assessment data required" });
    }

    const pdfBuffer = await generateRainwaterPDF(assessmentData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=jalsarathi-report.pdf"
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("💥 PDF generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate PDF report",
      details: error.message,
    });
  }
});

export default router;

