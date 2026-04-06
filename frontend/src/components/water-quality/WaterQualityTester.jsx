import React, { useState } from "react";
import { FlaskConical, AlertTriangle, Droplets, CheckCircle, Activity, ArrowRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import MapLocationPicker from "../common/MapLocationPicker";

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
      const response = await axios.post("http://localhost:3001/api/water-quality/calculate", formData);
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.error || "Failed to calculate HPI.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error connecting to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const chartData = [
      { name: "Lead", value: result.parameters.lead, standard: 0.01 },
      { name: "Arsenic", value: result.parameters.arsenic, standard: 0.01 },
      { name: "Mercury", value: result.parameters.mercury, standard: 0.001 },
    ];

    const getSafetyColor = (level) => {
      switch (level) {
        case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
        case "Good": return "text-blue-600 bg-blue-50 border-blue-200";
        case "Poor": return "text-amber-600 bg-amber-50 border-amber-200";
        case "Unsafe": return "text-red-600 bg-red-50 border-red-200";
        default: return "text-gray-600 bg-gray-50 border-gray-200";
      }
    };

    const safetyStyle = getSafetyColor(result.safety_level);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 w-full max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Assessment Results
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-sky-50 rounded-xl p-5 border border-sky-100 flex flex-col justify-center items-center text-center">
            <span className="text-sky-800 text-sm font-medium mb-1">Heavy Metal Pollution Index</span>
            <span className="text-4xl font-bold text-sky-600">{result.hpi}</span>
            <span className="text-sky-600/70 text-xs mt-2 uppercase tracking-wide">Base threshold: 100</span>
          </div>

          <div className={`rounded-xl p-5 border flex flex-col justify-center items-center text-center ${safetyStyle}`}>
            <span className="text-sm font-medium mb-1 opacity-80">Safety Level</span>
            <span className="text-2xl font-bold">{result.safety_level}</span>
            {result.safety_level === "Excellent" || result.safety_level === "Good" ? (
              <CheckCircle className="w-6 h-6 mt-2 opacity-80" />
            ) : (
              <AlertTriangle className="w-6 h-6 mt-2 opacity-80" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Contaminant Levels vs WHO Standards (mg/L)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > entry.standard ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1 align-middle"></span> Safe
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-4 mr-1 align-middle"></span> Exceeds Limit
          </p>
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
                onLocationSelected={(loc) => handleInputChange({ target: { name: 'location', value: loc } })}
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
