// frontend/src/components/Rainwater/CalculatorForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CalculatorForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    location: "",
    rooftopArea: "",
    buildingType: "concrete",
    householdMembers: "4",
    locationType: "urban",
  });
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  // ✅ Fetch city data from backend (rainwater.js)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/rainwater/demo-locations");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCities(data);
        if (data.length > 0 && !formData.location) {
          setFormData((prev) => ({ ...prev, location: data[0].name }));
        }
      } catch (err) {
        console.warn("⚠️ Backend not reachable, using fallback data");
        const fallback = [
          { id: 1, name: "Delhi", rainfall: 800, type: "urban" },
          { id: 2, name: "Mumbai", rainfall: 2200, type: "urban" },
          { id: 3, name: "Chennai", rainfall: 1400, type: "urban" },
          { id: 4, name: "Bengaluru", rainfall: 970, type: "urban" },
          { id: 5, name: "Kolkata", rainfall: 1800, type: "urban" },
          { id: 6, name: "Hyderabad", rainfall: 900, type: "urban" },
          { id: 7, name: "Jaipur", rainfall: 650, type: "semi-arid" },
          { id: 8, name: "Pune", rainfall: 1100, type: "urban" },
          { id: 9, name: "Dehradun", rainfall: 2100, type: "rural" },
          { id: 10, name: "Shimla", rainfall: 1500, type: "rural" },
        ];
        setCities(fallback);
        if (!formData.location) {
          setFormData((prev) => ({ ...prev, location: fallback[0].name }));
        }
      }
    };

    fetchCities();
  }, []);

  // ✅ Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ Validate + submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.rooftopArea) newErrors.rooftopArea = "Required field";
    if (formData.rooftopArea <= 0)
      newErrors.rooftopArea = "Must be greater than 0";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSubmit(formData);
  };

  const buildingTypes = [
    { value: "concrete", label: "🏠 Concrete Roof" },
    { value: "tiled", label: "🧱 Tiled Roof" },
    { value: "metal", label: "🏗️ Metal Sheet" },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="jalsarathi-card p-8 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        🌧️ Rainwater Potential Estimator
      </h3>

      {/* City Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select City
        </label>
        <select
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          {cities.map((city) => (
            <option key={city.id || city.name} value={city.name}>
              {city.name} ({city.rainfall}mm)
            </option>
          ))}
        </select>
      </div>

      {/* Rooftop Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rooftop Area (m²)
        </label>
        <input
          type="number"
          value={formData.rooftopArea}
          onChange={(e) => handleChange("rooftopArea", e.target.value)}
          placeholder="Enter rooftop size"
          min="1"
          required
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
            errors.rooftopArea ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.rooftopArea && (
          <p className="text-sm text-red-500 mt-1">{errors.rooftopArea}</p>
        )}
      </div>

      {/* Building Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Building Type
        </label>
        <select
          value={formData.buildingType}
          onChange={(e) => handleChange("buildingType", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
        >
          {buildingTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Household Members */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Household Members
        </label>
        <input
          type="number"
          value={formData.householdMembers}
          onChange={(e) => handleChange("householdMembers", e.target.value)}
          min="1"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 border-gray-300"
        />
      </div>

      {/* Area Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Area Type
        </label>
        <div className="flex space-x-4">
          {["urban", "rural"].map((type) => (
            <label
              key={type}
              className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                formData.locationType === type
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="locationType"
                value={type}
                checked={formData.locationType === type}
                onChange={(e) => handleChange("locationType", e.target.value)}
                className="mr-2 accent-blue-600"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Calculating..." : "💧 Calculate Rainwater Potential"}
      </motion.button>
    </motion.form>
  );
};

export default CalculatorForm;



