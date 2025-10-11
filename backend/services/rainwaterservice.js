// backend/services/rainwaterservice.js

// --- Rainfall data for Indian cities (mm/year) ---
const rainfallData = {
  delhi: 800,
  mumbai: 2200,
  chennai: 1400,
  bangalore: 970,
  kolkata: 1800,
  hyderabad: 800,
  pune: 750,
  ahmedabad: 800,
  jaipur: 600,
  lucknow: 900,
  dehradun: 2100,
  shimla: 1500,
  guwahati: 1800,
  bhopal: 1200,
  patna: 1100,
  bhubaneswar: 1500,
  chandigarh: 1100,
  ranchi: 1400,
  thiruvananthapuram: 1800,
  gandhinagar: 800,
};

// --- Runoff coefficients based on building type ---
const runoffCoefficients = {
  concrete: 0.8,
  tiled: 0.7,
  metal: 0.9,
  asphalt: 0.85,
};

// --- Water cost (₹ per liter) by region type ---
const waterCosts = {
  urban: 0.05,
  rural: 0.03,
};

/**
 * Calculates rainwater harvesting potential and economics.
 * @param {Object} params - { location, rooftopArea, buildingType, householdMembers, locationType }
 */
export const calculateRainwaterHarvesting = async (params) => {
  const { location, rooftopArea, buildingType, householdMembers, locationType } = params;

  const cityKey = location?.toLowerCase() || "default";
  const rainfall = rainfallData[cityKey] || 1000;
  const runoffCoefficient = runoffCoefficients[buildingType?.toLowerCase()] || 0.8;
  const waterCost = waterCosts[locationType?.toLowerCase()] || 0.05;

  // --- Harvestable water (liters per year) ---
  const harvestableWater = rooftopArea * rainfall * runoffCoefficient;

  // --- Annual savings (₹) ---
  const annualSavings = harvestableWater * waterCost;

  // --- Estimated system cost ---
  const systemCost = 5000 + harvestableWater * 2.5;

  // --- Payback period (years) ---
  const paybackPeriod = systemCost / (annualSavings || 1);

  // --- Water demand met (%) ---
  const dailyDemand = (householdMembers || 4) * 135; // liters/day
  const annualDemand = dailyDemand * 365;
  const demandMetPercent = Math.min((harvestableWater / annualDemand) * 100, 100);

  // --- Subsidy logic (higher for rural) ---
  const subsidyPercentage = locationType === "rural" ? 40 : 25;
  const subsidyAmount = (systemCost * subsidyPercentage) / 100;
  const effectiveCost = systemCost - subsidyAmount;
  const effectivePayback = effectiveCost / (annualSavings || 1);

  // --- Final structured response ---
  return {
    location,
    rainfall,
    runoffCoefficient,
    harvestableWater: Math.round(harvestableWater),
    annualSavings: Math.round(annualSavings),
    systemCost: Math.round(systemCost),
    paybackPeriod: paybackPeriod.toFixed(1),
    demandMetPercent: demandMetPercent.toFixed(1),
    subsidyAmount: Math.round(subsidyAmount),
    effectiveCost: Math.round(effectiveCost),
    effectivePayback: effectivePayback.toFixed(1),
    locationType,
    recommendations: generateRecommendations(locationType, demandMetPercent),
  };
};

// --- Generate simple advisory recommendations ---
const generateRecommendations = (locationType, demandMetPercent) => {
  const recommendations = [];

  if (locationType === "urban") {
    recommendations.push("Consider underground tanks to save space.");
    recommendations.push("Integrate system with toilet flushing and gardening.");
    recommendations.push("Check for municipal rainwater reuse rebates.");
  } else {
    recommendations.push("Opt for above-ground tanks for easy maintenance.");
    recommendations.push("Use harvested water for livestock and irrigation.");
    recommendations.push("Collaborate with local watershed programs.");
  }

  if (demandMetPercent > 80) {
    recommendations.push("Excellent potential — expand storage capacity.");
  } else if (demandMetPercent > 50) {
    recommendations.push("Good potential — can cut water bills significantly.");
  } else {
    recommendations.push("Moderate potential — combine with borewell recharge.");
  }

  return recommendations;
};
