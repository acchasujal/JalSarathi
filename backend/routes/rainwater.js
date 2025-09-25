import express from 'express';
import { calculateRainwaterHarvesting } from '../services/rainwaterService.js';
import { generateRainwaterPDF } from '../utils/pdfGenerator.js';
import { jalsarathiDB } from '../config/database.js';

const router = express.Router();

// Calculate rainwater harvesting potential
router.post('/calculate', async (req, res) => {
  try {
    const { location, rooftopArea, buildingType, householdMembers, locationType } = req.body;
    
    if (!location || !rooftopArea || !buildingType) {
      return res.status(400).json({
        error: 'Missing required fields: location, rooftopArea, buildingType'
      });
    }

    const result = await calculateRainwaterHarvesting({
      location,
      rooftopArea: parseFloat(rooftopArea),
      buildingType,
      householdMembers: parseInt(householdMembers) || 4,
      locationType: locationType || 'urban'
    });

    // Save to database
    const query = `INSERT INTO rainwater_assessments 
      (location, rooftop_area, building_type, household_members, location_type, rainfall_mm, harvestable_water, annual_savings, system_cost, payback_period) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    jalsarathiDB.db.run(query, [
      location,
      rooftopArea,
      buildingType,
      householdMembers,
      locationType,
      result.rainfall,
      result.harvestableWater,
      result.annualSavings,
      result.systemCost,
      result.paybackPeriod
    ], function(err) {
      if (err) {
        console.error('Error saving assessment:', err);
      }
    });

    res.json({
      success: true,
      data: result,
      message: 'Rainwater harvesting potential calculated successfully'
    });
  } catch (error) {
    console.error('Rainwater calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate rainwater potential',
      details: error.message
    });
  }
});

// Generate PDF report
router.post('/generate-pdf', async (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data required' });
    }

    const pdfBuffer = await generateRainwaterPDF(assessmentData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=jalsarathi-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// Get demo locations
router.get('/demo-locations', (req, res) => {
  const demoLocations = [
    { id: 1, name: 'Delhi', rainfall: 800, type: 'urban' },
    { id: 2, name: 'Mumbai', rainfall: 2200, type: 'urban' },
    { id: 3, name: 'Chennai', rainfall: 1400, type: 'urban' },
    { id: 4, name: 'Bangalore', rainfall: 970, type: 'urban' },
    { id: 5, name: 'Kolkata', rainfall: 1800, type: 'urban' },
    { id: 11, name: 'Dehradun', rainfall: 2100, type: 'rural' },
    { id: 12, name: 'Shimla', rainfall: 1500, type: 'rural' }
  ];
  
  res.json(demoLocations);
});

export default router;