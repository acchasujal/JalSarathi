import React, { useState } from "react";
import { motion } from "framer-motion";

const CalculatorForm = ({ onSubmit, loading, demoLocations = [] }) => {
  const [formData, setFormData] = useState({
    location: "Delhi",
    rooftopArea: "",
    buildingType: "concrete",
    householdMembers: "4",
    locationType: "urban",
  });

  const [errors, setErrors] = useState({});

  const buildingTypes = [
    { value: "concrete", label: "🏠 Concrete Roof" },
    { value: "tiled", label: "🧱 Tiled Roof" },
    { value: "metal", label: "🏗️ Metal Sheet" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.rooftopArea) newErrors.rooftopArea = "Required field";
    if (formData.rooftopArea <= 0) newErrors.rooftopArea = "Must be greater than 0";
    if (!formData.householdMembers) newErrors.householdMembers = "Required field";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSubmit(formData);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {demoLocations.length > 0 ? (
              demoLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.rainfall}mm) — {loc.type}
                </option>
              ))
            ) : (
              <option>Loading locations...</option>
            )}
          </select>
        </div>

        {/* Rooftop Area */}
        <div className="md:col-span-2">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Type
          </label>
          <select
            value={formData.buildingType}
            onChange={(e) => handleChange("buildingType", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {buildingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Household Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Household Members
          </label>
          <input
            type="number"
            value={formData.householdMembers}
            onChange={(e) => handleChange("householdMembers", e.target.value)}
            min="1"
            required
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
              errors.householdMembers ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.householdMembers && (
            <p className="text-sm text-red-500 mt-1">{errors.householdMembers}</p>
          )}
        </div>

        {/* Area Type */}
        <div className="md:col-span-2">
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
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={loading || !formData.rooftopArea}
        className="mt-8 w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Calculating...
          </span>
        ) : (
          "💧 Calculate Rainwater Potential"
        )}
      </motion.button>
    </motion.form>
  );
};

export default CalculatorForm;


