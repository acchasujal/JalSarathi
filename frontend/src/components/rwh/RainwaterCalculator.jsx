import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResultsDisplay from "./ResultsDisplay";

const RainwaterCalculator = () => {
  const [form, setForm] = useState({
    location: "Delhi",
    rooftopArea: "",
    buildingType: "concrete",
    householdMembers: 4,
    locationType: "urban",
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // ✅ Hardcoded rainfall data (matches backend rainwater.js)
  const fallbackLocations = [
    { id: 1, name: "Delhi", rainfall: 800, type: "urban" },
    { id: 2, name: "Mumbai", rainfall: 2200, type: "urban" },
    { id: 3, name: "Chennai", rainfall: 1400, type: "urban" },
    { id: 4, name: "Bangalore", rainfall: 970, type: "urban" },
    { id: 5, name: "Kolkata", rainfall: 1800, type: "urban" },
    { id: 6, name: "Jaipur", rainfall: 650, type: "semi-arid" },
    { id: 7, name: "Hyderabad", rainfall: 900, type: "urban" },
    { id: 8, name: "Pune", rainfall: 1100, type: "urban" },
    { id: 9, name: "Dehradun", rainfall: 2100, type: "rural" },
    { id: 10, name: "Shimla", rainfall: 1500, type: "rural" },
  ];

  // ✅ Fetch demo locations from backend or use fallback
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/rainwater/demo-locations");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setLocations(data);
        else setLocations(fallbackLocations);
      } catch {
        setLocations(fallbackLocations);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async () => {
    if (!form.rooftopArea) {
      alert("Please enter your rooftop area before calculating.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/rainwater/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Calculation failed");

      setResults(data.data);
    } catch (err) {
      console.error("Error calculating:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (assessmentData) => {
    try {
      const response = await fetch("/api/rainwater/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentData }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "jalsarathi-report.pdf";
      link.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Form */}
      <motion.div
        className="jalsarathi-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          🌧️ Rainwater Potential Estimator
        </h2>

        <label className="block text-gray-700 mb-1">Select City</label>
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name} ({loc.rainfall}mm) — {loc.type}
            </option>
          ))}
        </select>

        <label className="block text-gray-700 mb-1">Rooftop Area (m²)</label>
        <input
          type="number"
          name="rooftopArea"
          value={form.rooftopArea}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
          placeholder="Enter rooftop size"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Building Type</label>
            <select
              name="buildingType"
              value={form.buildingType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            >
              <option value="concrete">🏠 Concrete Roof</option>
              <option value="tile">🧱 Tile Roof</option>
              <option value="metal">🏗️ Metal Roof</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Household Members</label>
            <input
              type="number"
              name="householdMembers"
              value={form.householdMembers}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              min="1"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Area Type</label>
          <div className="flex gap-4 text-gray-700">
            {["urban", "rural"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="locationType"
                  value={type}
                  checked={form.locationType === type}
                  onChange={handleChange}
                />{" "}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading || !form.rooftopArea}
          className={`mt-6 w-full py-2 rounded-lg font-medium text-white transition-all ${
            loading || !form.rooftopArea
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Calculating..." : "💧 Calculate Rainwater Potential"}
        </button>
      </motion.div>

      {/* Right: Results */}
      <ResultsDisplay
        assessment={results}
        loading={loading}
        error={error}
        onGeneratePDF={handleGeneratePDF}
      />
    </div>
  );
};

export default RainwaterCalculator;






