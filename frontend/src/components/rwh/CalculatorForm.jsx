import React, { useState } from 'react';

const CalculatorForm = ({ onSubmit, loading, demoLocations }) => {
  const [formData, setFormData] = useState({
    location: 'delhi',
    rooftopArea: '',
    buildingType: 'concrete',
    householdMembers: '4',
    locationType: 'urban'
  });

  const buildingTypes = [
    { value: 'concrete', label: 'Concrete Roof' },
    { value: 'tiled', label: 'Tiled Roof' },
    { value: 'metal', label: 'Metal Sheet' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {demoLocations.map(loc => (
              <option key={loc.id} value={loc.name.toLowerCase()}>
                {loc.name} ({loc.rainfall}mm rainfall) - {loc.type}
              </option>
            ))}
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
            onChange={(e) => handleChange('rooftopArea', e.target.value)}
            placeholder="Enter rooftop area"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            required
          />
        </div>

        {/* Building Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Type
          </label>
          <select
            value={formData.buildingType}
            onChange={(e) => handleChange('buildingType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {buildingTypes.map(type => (
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
            onChange={(e) => handleChange('householdMembers', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            required
          />
        </div>

        {/* Location Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area Type
          </label>
          <div className="flex space-x-4">
            {['urban', 'rural'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value={type}
                  checked={formData.locationType === type}
                  onChange={(e) => handleChange('locationType', e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.rooftopArea}
        className="w-full jalsarathi-gradient text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Calculating...
          </span>
        ) : (
          'Calculate Rainwater Potential'
        )}
      </button>
    </form>
  );
};

export default CalculatorForm;