import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import ResultsDisplay from "./ResultsDisplay";
import MapLocationPicker from "../common/MapLocationPicker";
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
    // ← Exact coords from map pin (null = city name only)
    latitude: null,
    longitude: null,
  });

  const [locations, setLocations] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [hasMapCoords, setHasMapCoords] = useState(false);

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
      } catch {
        setLocations(fallbackLocations);
      }
    };
    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If user manually edits location, clear map coords
    if (name === "location") {
      setHasMapCoords(false);
      setForm((prev) => ({ ...prev, [name]: value, latitude: null, longitude: null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Called when user confirms a pin on the map
  // payload = { label: string, lat: number, lng: number }
  const handleMapLocationSelected = ({ label, lat, lng }) => {
    setForm((prev) => ({
      ...prev,
      location: label,
      latitude: lat,
      longitude: lng,
    }));
    setHasMapCoords(true);
    setShowMap(false);
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
        location: form.location,
        rooftopArea: Number(form.rooftopArea),
        buildingType: form.buildingType,
        householdMembers: Number(form.householdMembers),
        locationType: form.locationType,
        // Send exact coords if available — backend uses these for precision API
        ...(form.latitude !== null && {
          latitude: form.latitude,
          longitude: form.longitude,
        }),
      };

      const response = await calculateRainwater(payload);
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Calculation failed");
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
        className="jalsarathi-card p-6 border border-sky-100 shadow-sm rounded-2xl bg-white flex flex-col gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-sky-700 flex items-center gap-2">
          🌧️ Rainwater Potential Estimator
        </h2>

        {/* Location Field */}
        <div>
          <label className="block text-gray-700 mb-1.5 font-medium text-sm">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              list="calculator-cities-list"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Type a city or drop a map pin..."
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
              required
            />
            <datalist id="calculator-cities-list">
              {locations.map((loc) => (
                <option key={loc.id || loc.name} value={loc.name} />
              ))}
            </datalist>

            <button
              type="button"
              onClick={() => setShowMap(true)}
              title="Select from Map"
              className={`px-4 rounded-xl transition-colors flex items-center justify-center border shrink-0 ${
                hasMapCoords
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-sky-100 text-sky-600 hover:bg-sky-200 border-sky-200"
              }`}
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>

          {/* Precision indicator */}
          {hasMapCoords && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-xs text-sky-600 font-medium flex items-center gap-1"
            >
              ✨ Exact coordinates locked — precision calculation active
            </motion.p>
          )}
        </div>

        {/* Map Modal */}
        {showMap && (
          <MapLocationPicker
            onLocationSelected={handleMapLocationSelected}
            onClose={() => setShowMap(false)}
          />
        )}

        {/* Rooftop Area */}
        <div>
          <label className="block text-gray-700 mb-1.5 font-medium text-sm">
            Rooftop Area (m²)
          </label>
          <input
            type="number"
            name="rooftopArea"
            value={form.rooftopArea}
            onChange={handleChange}
            placeholder="e.g. 120"
            min="1"
            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Building Type & Household Members */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1.5 font-medium text-sm">
              Building Type
            </label>
            <select
              name="buildingType"
              value={form.buildingType}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm bg-white"
            >
              <option value="concrete">🏠 Concrete Roof</option>
              <option value="tiled">🧱 Tiled Roof</option>
              <option value="metal">🏗️ Metal Roof</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1.5 font-medium text-sm">
              Household Members
            </label>
            <input
              type="number"
              name="householdMembers"
              min="1"
              value={form.householdMembers}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Area Type */}
        <div>
          <label className="block text-gray-700 mb-1.5 font-medium text-sm">
            Area Type
          </label>
          <div className="flex gap-3">
            {["urban", "rural"].map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm font-medium capitalize ${
                  form.locationType === type
                    ? "bg-sky-600 text-white border-sky-600"
                    : "border-gray-200 text-gray-600 hover:bg-sky-50"
                }`}
              >
                <input
                  type="radio"
                  name="locationType"
                  value={type}
                  checked={form.locationType === type}
                  onChange={handleChange}
                  className="hidden"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading || !form.rooftopArea}
          className={`w-full py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
            loading || !form.rooftopArea
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-200"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching Precision Data...
            </>
          ) : (
            "💧 Calculate Rainwater Potential"
          )}
        </button>

        {/* Refresh with Map coords shortcut */}
        {results && hasMapCoords && (
          <button
            onClick={handleCalculate}
            className="text-xs text-sky-600 hover:underline flex items-center gap-1 justify-center"
          >
            <RefreshCw className="w-3 h-3" /> Re-run with current map location
          </button>
        )}
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
