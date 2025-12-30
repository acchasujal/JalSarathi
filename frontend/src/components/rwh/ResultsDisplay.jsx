"use client"

import { motion } from "framer-motion"
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
  CartesianGrid,
} from "recharts"

/* ------------------ CONSTANT COLORS (LIGHT THEME) ------------------ */
const COLORS = {
  primary: "#2563EB",   // blue-600
  success: "#16A34A",   // green-600
  warning: "#F59E0B",   // amber-500
  grid: "#E5E7EB",      // gray-200
  text: "#1F2937",      // gray-800
  muted: "#6B7280",     // gray-500
}

/* ------------------ TOOLTIP ------------------ */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      {label && <p className="font-semibold text-gray-800 mb-1">{label}</p>}
      {payload.map((item, i) => (
        <p key={i} className="text-sm text-gray-700">
          <span style={{ color: item.color }}>{item.name}:</span>{" "}
          <span className="font-semibold">{item.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

/* ------------------ CARD WRAPPER ------------------ */
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-5">
    <h4 className="text-center font-semibold text-gray-800 mb-4">{title}</h4>
    {children}
  </div>
)

/* ------------------ MAIN COMPONENT ------------------ */
const ResultsDisplay = ({ assessment, loading, error, onGeneratePDF }) => {
  if (loading) {
    return (
      <div className="jalsarathi-card text-center p-6 animate-pulse">
        <p className="text-gray-600">💧 Calculating, please wait...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
        <strong>Error:</strong> {error}
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="jalsarathi-card text-center text-gray-500 p-6">
        Enter details and click <strong className="text-blue-600">Calculate</strong>
      </div>
    )
  }

  const {
    rainfall,
    harvestableWater,
    annualSavings,
    systemCost,
    subsidyAmount,
    effectiveCost,
    demandMetPercent,
    recommendations,
  } = assessment

  /* ------------------ DATA ------------------ */
  const costData = [
    { name: "System Cost", value: systemCost },
    { name: "Subsidy", value: subsidyAmount },
    { name: "Effective Cost", value: effectiveCost },
  ]

  const demandData = [
    { name: "Met", value: demandMetPercent },
    { name: "Unmet", value: 100 - demandMetPercent },
  ]

  const cityData = [
    { city: "Mumbai", rainfall: 2400, harvest: 112000 },
    { city: "Delhi", rainfall: 800, harvest: 64000 },
    { city: "Pune", rainfall: 900, harvest: 50000 },
    { city: "Your Site", rainfall, harvest: harvestableWater },
  ]

  return (
    <motion.div
      className="jalsarathi-card border-t-4 border-blue-500 p-6 space-y-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-2xl font-semibold text-blue-700 text-center">
        🌧️ Rainwater Harvesting Results
      </h3>

      {/* ------------------ SUMMARY ------------------ */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-gray-600">Annual Rainfall</p>
          <p className="text-2xl font-bold text-blue-600">{rainfall} mm</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-gray-600">Harvestable Water</p>
          <p className="text-2xl font-bold text-green-600">
            {harvestableWater.toLocaleString()} L
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-gray-600">Annual Savings</p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹{annualSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ------------------ CHARTS ------------------ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cost Chart */}
        <ChartCard title="💰 Cost & Subsidy Overview">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={costData}>
              <CartesianGrid stroke={COLORS.grid} />
              <XAxis dataKey="name" tick={{ fill: COLORS.text }} />
              <YAxis tick={{ fill: COLORS.text }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill={COLORS.primary}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Demand Pie */}
        <ChartCard title="💧 Water Demand Coverage">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={demandData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
              >
                <Cell fill={COLORS.success} />
                <Cell fill={COLORS.warning} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* City Comparison */}
        <ChartCard title="🌦️ City-wise Comparison">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={cityData}>
              <CartesianGrid stroke={COLORS.grid} />
              <XAxis dataKey="city" tick={{ fill: COLORS.text }} />
              <YAxis tick={{ fill: COLORS.text }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                dataKey="rainfall"
                stroke={COLORS.primary}
                strokeWidth={2.5}
                name="Rainfall (mm)"
              />
              <Line
                dataKey="harvest"
                stroke={COLORS.success}
                strokeWidth={2.5}
                name="Harvest (L)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ------------------ RECOMMENDATIONS ------------------ */}
      {recommendations?.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-700 mb-2">
            💡 Recommendations
          </h4>
          <ul className="list-disc list-inside text-gray-700">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ------------------ DOWNLOAD ------------------ */}
      <button
        onClick={() => onGeneratePDF(assessment)}
        className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
      >
        📄 Download PDF Report
      </button>
    </motion.div>
  );
}

export default ResultsDisplay








