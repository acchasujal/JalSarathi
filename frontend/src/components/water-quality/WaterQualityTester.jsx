import React, { useState } from 'react';

const WaterQualityTester = () => {
  const [formData, setFormData] = useState({
    lead: '',
    arsenic: '',
    mercury: ''
  });

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">⚗️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Quality Tester</h2>
      <p className="text-gray-600 mb-6">
        Heavy metal contamination analysis (Coming Soon)
      </p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-yellow-800">
          This feature will be available in the next release. Focused on rainwater harvesting for the MVP.
        </p>
      </div>
    </div>
  );
};

export default WaterQualityTester;