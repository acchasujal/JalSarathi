import React, { useState } from "react";
import { FlaskConical, AlertTriangle, Droplets, CheckCircle, Activity, ArrowRight, MapPin, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import MapLocationPicker from "../common/MapLocationPicker";
import { calculateWaterQuality } from "../../services/api";

const WaterQualityTester = () => {
  const [formData, setFormData] = useState({
    location: "",
    lead: "",
    arsenic: "",
    mercury: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateQuality = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await calculateWaterQuality(formData);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to calculate HPI.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error connecting to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const STANDARDS = [
    { name: "Lead (Pb)",    key: "lead",    limit: 0.01,  unit: "mg/L", risk: "Neurological damage, kidney issues" },
    { name: "Arsenic (As)", key: "arsenic", limit: 0.01,  unit: "mg/L", risk: "Cancer, skin lesions" },
    { name: "Mercury (Hg)", key: "mercury", limit: 0.001, unit: "mg/L", risk: "Kidney damage, nervous system" },
  ];

  const renderResult = () => {
    if (!result) return null;

    // Grouped bar chart: actual value + WHO safe limit side by side
    const chartData = STANDARDS.map(s => ({
      name: s.name.split(" ")[0], // "Lead", "Arsenic", "Mercury"
      "Your Value": result.parameters[s.key],
      "Safe Limit":  s.limit,
      exceeds: result.parameters[s.key] > s.limit,
    }));

    const getSafetyColor = (level) => {
      switch (level) {
        case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
        case "Good":      return "text-blue-600 bg-blue-50 border-blue-200";
        case "Poor":      return "text-amber-600 bg-amber-50 border-amber-200";
        case "Unsafe":    return "text-red-600 bg-red-50 border-red-200";
        default:          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    };

    const safetyStyle = getSafetyColor(result.safety_level);

    // Custom tooltip for grouped chart
    const CustomTooltip = ({ active, payload, label }) => {
      if (!active || !payload?.length) return null;
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map(p => (
            <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
              {p.dataKey}: {p.value} mg/L
            </p>
          ))}
        </div>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 w-full"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Assessment Results
        </h3>

        {/* HPI + Safety Level */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex flex-col justify-center items-center text-center">
            <span className="text-sky-800 text-xs font-medium mb-1">Heavy Metal Pollution Index</span>
            <span className="text-3xl font-bold text-sky-600">{result.hpi}</span>
            <span className="text-sky-500 text-[10px] mt-1 uppercase tracking-wide">Threshold: 100</span>
          </div>
          <div className={`rounded-xl p-4 border flex flex-col justify-center items-center text-center ${safetyStyle}`}>
            <span className="text-xs font-medium mb-1 opacity-80">Safety Level</span>
            <span className="text-2xl font-bold">{result.safety_level}</span>
            {result.safety_level === "Excellent" || result.safety_level === "Good"
              ? <CheckCircle className="w-5 h-5 mt-1.5 opacity-80" />
              : <AlertTriangle className="w-5 h-5 mt-1.5 opacity-80" />}
          </div>
        </div>

        {/* Grouped bar chart */}
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Values vs WHO Safe Limits (mg/L)</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%" barGap={4} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Your Value" radius={[4,4,0,0]}>
                  {chartData.map((entry, i) => (
                    <rect key={i} fill={entry.exceeds ? '#ef4444' : '#22c55e'} />
                  ))}
                  {/* Recharts doesn't support per-cell color in grouped bar easily, use fill prop */}
                </Bar>
                <Bar dataKey="Your Value" radius={[4,4,0,0]} fill="#ef4444" legendType="none" />
                <Bar dataKey="Safe Limit" radius={[4,4,0,0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 justify-center mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block"></span> Your measured value</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block"></span> WHO safe limit</span>
          </div>
        </div>

        {/* Standards reference table */}
        <div className="mt-5 rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <Info className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold text-gray-700">WHO Safe Drinking Water Standards</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 bg-gray-50/50">
                <th className="text-left px-4 py-2 font-medium">Chemical</th>
                <th className="text-left px-4 py-2 font-medium">Your Value</th>
                <th className="text-left px-4 py-2 font-medium">Safe Limit</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {STANDARDS.map((s) => {
                const val = result.parameters[s.key];
                const safe = val <= s.limit;
                return (
                  <tr key={s.key} className="border-t border-gray-50">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-gray-800">{s.name}</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">{s.risk}</span>
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${safe ? 'text-emerald-600' : 'text-red-600'}`}>{val} {s.unit}</td>
                    <td className="px-4 py-2.5 text-gray-500">{s.limit} {s.unit}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        safe ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {safe ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {safe ? 'Safe' : 'Exceeds'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-6 flex flex-col bg-white rounded-2xl"
    >
      <div className="mb-8 text-center">
         <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-full mb-4 text-sky-600">
           <FlaskConical className="w-8 h-8" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Quality Tester</h2>
         <p className="text-gray-600 text-sm max-w-lg mx-auto">
           Enter your lab test values below to calculate the Heavy Metal Pollution Index (HPI) and determine your water's safety level.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 md:p-8">
          <form onSubmit={calculateQuality} className="space-y-4">
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Identifier</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="e.g. Borewell #3, Delhi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="px-4 bg-sky-100 text-sky-600 hover:bg-sky-200 rounded-xl transition-colors flex items-center justify-center border border-sky-200"
                  title="Select from Map"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showMap && (
              <MapLocationPicker
                onLocationSelected={(loc) => handleInputChange({ target: { name: 'location', value: loc.label } })}
                onClose={() => setShowMap(false)}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead (Pb) mg/L</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  name="lead"
                  value={formData.lead}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arsenic (As) mg/L</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  name="arsenic"
                  value={formData.arsenic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mercury (Hg)</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  name="mercury"
                  value={formData.mercury}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 hover:shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Calculate HPI
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="w-full flex justify-center items-start">
          <AnimatePresence mode="wait">
            {result ? (
              renderResult()
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12 text-center text-gray-400 p-8 border border-dashed border-gray-200 rounded-2xl w-full"
              >
                <Droplets className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Fill out the parameters to view your <br/>Heavy Metal Pollution Index (HPI) analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default WaterQualityTester;
