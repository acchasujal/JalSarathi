import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResultsDisplay from "./ResultsDisplay";
import {
  getDemoLocations,
  calculateRainwater,
  generatePDF,
} from "../../services/api";

const RainwaterCalculator = () => {
  const [form, setForm] = useState({
    location: "Delhi",
    rooftopArea: "",
    buildingType: "concrete",
    householdMembers: 4,
    locationType: "urban",
  });

  const [locations, setLocations] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback (must match backend)
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

  // Load cities
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getDemoLocations();
        if (Array.isArray(data) && data.length > 0) {
          setLocations(data);
          setForm((prev) => ({ ...prev, location: data[0].name }));
        } else {
          setLocations(fallbackLocations);
        }
      } catch (err) {
        console.warn("Using fallback city data");
        setLocations(fallbackLocations);
      }
    };

    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async () => {
    if (!form.rooftopArea || Number(form.rooftopArea) <= 0) {
      alert("Please enter a valid rooftop area");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const payload = {
        ...form,
        rooftopArea: Number(form.rooftopArea),
        householdMembers: Number(form.householdMembers),
      };

      const response = await calculateRainwater(payload);
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (assessmentData) => {
    try {
      const blob = await generatePDF(assessmentData);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "jalsarathi-report.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* LEFT: FORM */}
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
          className="w-full mb-4 p-2 border rounded-lg"
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
          className="w-full mb-4 p-2 border rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Building Type</label>
            <select
              name="buildingType"
              value={form.buildingType}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="concrete">🏠 Concrete Roof</option>
              <option value="tiled">🧱 Tiled Roof</option>
              <option value="metal">🏗️ Metal Roof</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Household Members
            </label>
            <input
              type="number"
              name="householdMembers"
              min="1"
              value={form.householdMembers}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Area Type</label>
          <div className="flex gap-4">
            {["urban", "rural"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="locationType"
                  value={type}
                  checked={form.locationType === type}
                  onChange={handleChange}
                />{" "}
                {type}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading || !form.rooftopArea}
          className={`mt-6 w-full py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
          }`}
        >
          {loading ? "Calculating..." : "💧 Calculate Rainwater Potential"}
        </button>
      </motion.div>

      {/* RIGHT: RESULTS */}
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








