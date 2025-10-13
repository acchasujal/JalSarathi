import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useThemeColors from "../../hooks/useThemeColors";

const ResultsDisplay = ({ assessment, loading, error, onGeneratePDF }) => {
  const { isDarkMode, textColor, tooltipBg, tooltipText, primary } = useThemeColors();

  if (loading) {
    return (
      <div className="jalsarathi-card text-center p-6 animate-pulse">
        <p className="text-gray-600 dark:text-gray-300">💧 Calculating, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 p-4 rounded-xl">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="jalsarathi-card text-center text-gray-500 p-6">
        <p>
          Enter your details and click{" "}
          <strong className="text-blue-600 dark:text-sky-400">Calculate</strong> to view results.
        </p>
      </div>
    );
  }

  const {
    rainfall,
    harvestableWater,
    annualSavings,
    systemCost,
    demandMetPercent,
    subsidyAmount,
    effectiveCost,
    recommendations,
  } = assessment;

  // Chart Data
  const costData = [
    { label: "System Cost", value: systemCost },
    { label: "Subsidy", value: subsidyAmount },
    { label: "Effective Cost", value: effectiveCost },
  ];

  const demandData = [
    { name: "Met", value: demandMetPercent },
    { name: "Unmet", value: 100 - demandMetPercent },
  ];

  // ✅ Replace this later with live IMD / Open-Meteo API data
  const cityRainData = [
    { city: "Mumbai", rainfall: 2400, harvest: 112000 },
    { city: "Delhi", rainfall: 700, harvest: 30000 },
    { city: "Pune", rainfall: 900, harvest: 50000 },
    { city: "Chennai", rainfall: 1400, harvest: 80000 },
    { city: "Kolkata", rainfall: 1600, harvest: 85000 },
    { city: "Your Site", rainfall, harvest: harvestableWater },
  ];

  const COLORS = [primary, "#60A5FA", "#34D399"];

  return (
    <motion.div
      className="jalsarathi-card border-t-4 border-blue-500 p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-2xl font-semibold text-blue-700 dark:text-sky-300 text-center mb-2">
        🌧️ Rainwater Harvesting Results
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Annual Rainfall",
            value: `${rainfall} mm`,
            color: "text-blue-600 dark:text-sky-400",
          },
          {
            title: "Harvestable Water",
            value: `${harvestableWater.toLocaleString()} L`,
            color: "text-green-600 dark:text-green-400",
          },
          {
            title: "Annual Savings",
            value: `₹${annualSavings.toLocaleString()}`,
            color: "text-emerald-600 dark:text-emerald-400",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 text-center shadow hover:shadow-lg transition-all duration-300"
          >
            <h4 className="text-gray-700 dark:text-gray-300 font-semibold">{card.title}</h4>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {/* --- Cost Breakdown --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
          <h4 className="text-lg font-semibold text-blue-600 dark:text-sky-300 mb-3 text-center">
            💰 Cost & Subsidy Overview
          </h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <XAxis dataKey="label" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: "8px",
                    border: "none",
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Bar dataKey="value" fill={primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Water Demand Coverage --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
          <h4 className="text-lg font-semibold text-blue-600 dark:text-sky-300 mb-3 text-center">
            💧 Water Demand Coverage
          </h4>
          <div className="w-full h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="100%">
              <PieChart>
                <Pie
                  data={demandData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {demandData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: "8px",
                    border: "none",
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- City Rainfall Trend --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
          <h4 className="text-lg font-semibold text-blue-600 dark:text-sky-300 mb-3 text-center">
            🌦️ City-wise Rainfall & Harvest Potential
          </h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cityRainData}>
                <XAxis dataKey="city" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: "8px",
                    border: "none",
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rainfall"
                  stroke={primary}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Avg Rainfall (mm)"
                />
                <Line
                  type="monotone"
                  dataKey="harvest"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Harvest Potential (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="mt-4 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-4">
          <h4 className="font-semibold text-blue-700 dark:text-sky-300 mb-2">
            💡 Recommendations:
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={() => onGeneratePDF(assessment)}
        className="w-full mt-4 py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
      >
        📊 Download PDF Report
      </button>
    </motion.div>
  );
};

export default ResultsDisplay;







