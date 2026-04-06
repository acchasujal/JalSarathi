// backend/services/rainwaterservice.js

import { fetchPreciseRainfall } from '../utils/weatherProvider.js';

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
  const { location, rooftopArea, buildingType, householdMembers, locationType, latitude: lat, longitude: lon } = params;

  // Step 1: Read exact coords if provided (from map pin via frontend)
  // These come as clean floats from the route now — no regex hacks needed
  const latitude = lat ?? null;
  const longitude = lon ?? null;

  const cityKey = location?.toLowerCase().split(" (")[0].trim() || "default"; // strip any "(lat,lng)" suffix

  // Step 2: High-Precision Engine
  let rainfall = null;
  let accuracyScore = 50;
  let dataSource = "Unknown";
  let isPrecision = false;

  if (latitude !== null && longitude !== null) {
    // We have exact coords → call Visual Crossing via weatherProvider
    const preciseData = await fetchPreciseRainfall(latitude, longitude);

    if (preciseData?.rateLimited) {
      // ⚠️ HTTP 429 — API quota exhausted → fall back to city-name lookup
      console.warn('[rainwaterservice] ⚠️ Rate-limited by Visual Crossing — using city fallback');
      if (rainfallData[cityKey]) {
        rainfall     = rainfallData[cityKey];
        accuracyScore = 65;
        dataSource   = `Local Station (Fallback — API Rate Limited)`;
      }
      // If city not in table either, the cascade below handles it
    } else if (preciseData?.rainfall) {
      // ✅ Success: satellite / DB-cache data
      rainfall      = preciseData.rainfall;
      accuracyScore = preciseData.accuracyScore; // 97 (API) or 98 (DB cache)
      dataSource    = preciseData.dataSource;
      isPrecision   = true;
    }
    // If preciseData is null or has no rainfall, fall through to cascade below
  }

  // Step 3: Fallback cascade (runs when no precise data was resolved above)
  if (!rainfall) {
    if (rainfallData[cityKey]) {
      rainfall      = rainfallData[cityKey];
      // Only raise score to 75 if we haven’t already set 65 from a 429
      if (accuracyScore > 65) {
        accuracyScore = 75;
        dataSource    = 'Local Station Data';
      }
    } else if (params.rainfall) {
      rainfall      = params.rainfall;
      accuracyScore = 60;
      dataSource    = 'City Reference Data';
    } else {
      rainfall      = 1000; // national mean — last resort
      accuracyScore = 40;
      dataSource    = 'Regional State Average';
    }
  }

  // Step 4: Resolve coefficients BEFORE any logging or math
  const runoffCoefficient = runoffCoefficients[buildingType?.toLowerCase()] || 0.8;
  const waterCost = waterCosts[locationType?.toLowerCase()] || 0.05;

  // --- Harvestable water (liters/year) ---
  // UNIT PROOF: 1 m² rooftop × 1 mm rain = 0.001 m³ = 1 L
  //   ∴ harvestableWater [L] = rooftopArea [m²] × rainfall [mm] × runoffCoefficient
  //   Dividing rainfall by 1000 first would give m³, not L — causing a 1000× undercount.
  const harvestableWater = rooftopArea * rainfall * runoffCoefficient;

  console.log(`[rainwaterservice] ── FORMULA INPUTS ──`);
  console.log(`  location   : ${location}`);
  console.log(`  lat/lng    : ${latitude ?? 'null'} / ${longitude ?? 'null'}`);
  console.log(`  rainfall   : ${rainfall}mm  (source: ${dataSource}, accuracy: ${accuracyScore}%)`);
  console.log(`  rooftopArea: ${rooftopArea}m²  | runoff: ${runoffCoefficient}`);
  console.log(`  harvestable: ${rooftopArea} × ${rainfall} × ${runoffCoefficient} = ${harvestableWater}L`);

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
    rainfall: Math.round(rainfall),
    rainfallUsed: Math.round(rainfall), // specific prompt requirement aliasing
    accuracyScore,
    dataSource,
    isPrecision,
    totalHarvest: Math.round(harvestableWater), // specific prompt requirement aliasing
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

