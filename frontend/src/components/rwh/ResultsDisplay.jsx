"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
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
    accuracyScore,
    dataSource,
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

  // ── Accuracy Tier ─────────────────────────────────────────────────────────
  const getAccuracyTier = (score) => {
    if (score > 90) return {
      color: "bg-green-100 text-green-700 border-green-200",
      barColor: "bg-green-500",
      dotColor: "bg-green-500",
      badgeBg: "bg-green-50 border-green-300",
      badgeText: "text-green-800",
      label: "Verified High Accuracy",
      icon: "🛰️",
      tip: "Data fetched directly from satellite-calibrated weather stations at your exact coordinates."
    };
    if (score >= 65) return {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      barColor: "bg-yellow-400",
      dotColor: "bg-yellow-400",
      badgeBg: "bg-yellow-50 border-yellow-300",
      badgeText: "text-yellow-800",
      label: "Standard Accuracy",
      icon: "📡",
      tip: "API rate limit reached or no coordinates provided. Using nearest city station data."
    };
    return {
      color: "bg-red-100 text-red-700 border-red-200",
      barColor: "bg-red-400",
      dotColor: "bg-orange-400",
      badgeBg: "bg-orange-50 border-orange-300",
      badgeText: "text-orange-800",
      label: "General Estimate",
      icon: "📊",
      tip: "Using city-level or state-level averages. Use the map pin for precision satellite data."
    };
  };

  const [showTip, setShowTip] = useState(false);
  const tier = getAccuracyTier(accuracyScore || 0);

  // Animated counter for accuracy %
  const motionScore = useMotionValue(0);
  const springScore = useSpring(motionScore, { stiffness: 70, damping: 20 });
  const displayScore = useTransform(springScore, (v) => Math.round(v));

  useEffect(() => {
    motionScore.set(accuracyScore || 0);
  }, [accuracyScore, motionScore]);

  return (
    <motion.div
      className="jalsarathi-card border-t-4 border-sky-500 p-6 space-y-6 bg-white rounded-2xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-2xl font-semibold text-sky-700 text-center">
          🌧️ Rainwater Harvesting Results
        </h3>

        {/* ── Accuracy Badge ── */}
        {accuracyScore != null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold cursor-help ${tier.color}`}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            <span>{tier.icon}</span>
            <span>{tier.label}</span>
            <span className="opacity-60">•</span>
            <span><motion.span>{displayScore}</motion.span>% Accuracy</span>
            <span className="underline decoration-dotted opacity-70">ⓘ</span>

            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 z-50 shadow-xl pointer-events-none"
                >
                  {tier.tip}
                  {dataSource && (
                    <p className="mt-1 opacity-60 text-[10px]">Source: {dataSource}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Accuracy % Bar */}
        {accuracyScore != null && (
          <div className="w-full max-w-xs">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${tier.barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${accuracyScore}%` }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ------------------ SUMMARY ------------------ */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className={`rounded-xl p-4 text-center border shadow-sm ${accuracyScore > 90 ? 'bg-sky-50 border-sky-200' : accuracyScore >= 70 ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
          <p className="text-gray-600 font-medium text-sm flex items-center justify-center gap-1">
            {tier.icon} {accuracyScore > 90 ? "Hyper-Local Rainfall" : "Estimated Rainfall"}
          </p>
          <p className={`text-2xl font-bold mt-1 ${accuracyScore > 90 ? 'text-sky-600' : accuracyScore >= 70 ? 'text-yellow-600' : 'text-gray-600'}`}>
            {rainfall} mm
          </p>
          {dataSource && (
            <p className="text-[11px] text-gray-400 mt-1 leading-tight">
              Source: {dataSource}
            </p>
          )}
        </div>
        <div className="bg-green-50 border border-green-100 shadow-sm rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm font-medium">Harvestable Water</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {harvestableWater.toLocaleString()} L
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 shadow-sm rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm font-medium">Annual Savings</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            ₹{annualSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ------------------ DATA RELIABILITY SECTION ------------------ */}
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          🛡️ Data Reliability
        </h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${tier.badgeBg} ${tier.badgeText}`}>
            <span className={`w-2 h-2 rounded-full ${tier.dotColor}`} />
            <span>{tier.icon} {tier.label}</span>
            <span className="opacity-50">|</span>
            <span><motion.span>{displayScore}</motion.span>%</span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[80px]">
            <motion.div
              className={`h-full rounded-full ${tier.barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${accuracyScore || 0}%` }}
              transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
            />
          </div>

          {/* Source */}
          {dataSource && (
            <p className="text-xs text-gray-500 shrink-0">
              {dataSource}
            </p>
          )}
        </div>

        {/* Tip */}
        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{tier.tip}</p>
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








