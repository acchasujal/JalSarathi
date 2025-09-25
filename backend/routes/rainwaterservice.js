// Rainfall data for Indian cities (mm per year)
const rainfallData = {
  'delhi': 800,
  'mumbai': 2200,
  'chennai': 1400,
  'bangalore': 970,
  'kolkata': 1800,
  'hyderabad': 800,
  'pune': 750,
  'ahmedabad': 800,
  'jaipur': 600,
  'lucknow': 900,
  'dehradun': 2100,
  'shimla': 1500,
  'guwahati': 1800,
  'bhopal': 1200,
  'patna': 1100,
  'bhubaneswar': 1500,
  'chandigarh': 1100,
  'ranchi': 1400,
  'thiruvananthapuram': 1800,
  'gandhinagar': 800
};

// Runoff coefficients based on building type
const runoffCoefficients = {
  'concrete': 0.8,
  'tiled': 0.7,
  'metal': 0.9,
  'asphalt': 0.85
};

// Water cost per liter by city type (₹)
const waterCosts = {
  'urban': 0.05,
  'rural': 0.03
};

export const calculateRainwaterHarvesting = async (params) => {
  const { location, rooftopArea, buildingType, householdMembers, locationType } = params;
  
  // Get rainfall data
  const rainfall = rainfallData[location.toLowerCase()] || 1000;
  const runoffCoefficient = runoffCoefficients[buildingType] || 0.8;
  const waterCost = waterCosts[locationType] || 0.05;
  
  // Calculate harvestable water (liters per year)
  const harvestableWater = rooftopArea * rainfall * runoffCoefficient;
  
  // Calculate annual savings
  const annualSavings = harvestableWater * waterCost;
  
  // Estimate system cost (₹5000 base + ₹2.5 per liter capacity)
  const systemCost = 5000 + (harvestableWater * 2.5);
  
  // Calculate payback period (years)
  const paybackPeriod = systemCost / annualSavings;
  
  // Calculate water demand met
  const dailyDemand = householdMembers * 135; // 135L per person per day
  const annualDemand = dailyDemand * 365;
  const demandMetPercent = Math.min((harvestableWater / annualDemand) * 100, 100);
  
  // Subsidy calculation
  const subsidyPercentage = locationType === 'rural' ? 40 : 25;
  const subsidyAmount = (systemCost * subsidyPercentage) / 100;
  const effectiveCost = systemCost - subsidyAmount;
  const effectivePayback = effectiveCost / annualSavings;
  
  return {
    rainfall,
    harvestableWater: Math.round(harvestableWater),
    annualSavings: Math.round(annualSavings),
    systemCost: Math.round(systemCost),
    paybackPeriod: paybackPeriod.toFixed(1),
    demandMetPercent: demandMetPercent.toFixed(1),
    subsidyAmount: Math.round(subsidyAmount),
    effectiveCost: Math.round(effectiveCost),
    effectivePayback: effectivePayback.toFixed(1),
    locationType,
    recommendations: generateRecommendations(locationType, demandMetPercent)
  };
};

const generateRecommendations = (locationType, demandMetPercent) => {
  const recommendations = [];
  
  if (locationType === 'urban') {
    recommendations.push('Consider underground storage tanks to save space');
    recommendations.push('Connect system to toilet flushing and gardening');
    recommendations.push('Apply for municipal building plan approvals');
  } else {
    recommendations.push('Opt for above-ground storage for easy maintenance');
    recommendations.push('Use harvested water for irrigation and livestock');
    recommendations.push('Coordinate with local watershed development programs');
  }
  
  if (demandMetPercent > 80) {
    recommendations.push('Excellent potential - consider expanding system capacity');
  } else if (demandMetPercent > 50) {
    recommendations.push('Good potential - system will significantly reduce water bills');
  } else {
    recommendations.push('Consider supplementing with other water sources');
  }
  
  return recommendations;
};