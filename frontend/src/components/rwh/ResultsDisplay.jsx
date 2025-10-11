import React from "react";
import { motion } from "framer-motion";

const ResultsDisplay = ({ assessment, loading, error, onGeneratePDF }) => {
  if (loading) {
    return (
      <div className="jalsarathi-card text-center p-6 animate-pulse">
        <p className="text-gray-600">💧 Calculating, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="jalsarathi-card text-center text-gray-500 p-6">
        <p>
          Enter your details and click{" "}
          <strong className="text-blue-600">Calculate</strong> to view results.
        </p>
      </div>
    );
  }

  const {
    rainfall,
    harvestableWater,
    annualSavings,
    systemCost,
    paybackPeriod,
    demandMetPercent,
    subsidyAmount,
    effectiveCost,
    effectivePayback,
    recommendations
  } = assessment;

  return (
    <motion.div
      className="jalsarathi-card border-t-4 border-blue-500 p-6 space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-2xl font-semibold text-blue-700 text-center">
        🌧️ Rainwater Harvesting Results
      </h3>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div className="space-y-2">
          <p><strong>Rainfall:</strong> {rainfall} mm</p>
          <p><strong>Harvestable Water:</strong> {harvestableWater.toLocaleString()} L</p>
          <p><strong>Annual Savings:</strong> ₹{annualSavings.toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <p><strong>System Cost:</strong> ₹{systemCost.toLocaleString()}</p>
          <p><strong>Payback Period:</strong> {paybackPeriod} years</p>
          <p><strong>Demand Met:</strong> {demandMetPercent}%</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p><strong>Subsidy:</strong> ₹{subsidyAmount.toLocaleString()}</p>
        <p><strong>Effective Cost:</strong> ₹{effectiveCost.toLocaleString()}</p>
        <p><strong>Effective Payback:</strong> {effectivePayback} years</p>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-semibold text-blue-700 mb-2">💡 Recommendations:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PDF Download */}
      <button
        onClick={() => onGeneratePDF(assessment)}
        className="w-full mt-4 py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transition-all shadow-md hover:shadow-lg"
      >
        📄 Download PDF Report
      </button>
    </motion.div>
  );
};

export default ResultsDisplay;



