import React from 'react';
import RainwaterCalculator from '../components/rwh/RainwaterCalculator';
import WaterQualityTester from '../components/water-quality/WaterQualityTester';
import { useWater } from '../context/WaterContext';

const HomePage = () => {
  const { activeTab, setActiveTab } = useWater();

  const tabs = [
    { id: 'rainwater', name: '🌧️ Rainwater Calculator', component: RainwaterCalculator },
    { id: 'water-quality', name: '⚗️ Water Quality Test', component: WaterQualityTester }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          JalSarathi Water Management
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate rainwater harvesting potential and test water quality with our 
          comprehensive tools. Make informed decisions for sustainable water management.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="jalsarathi-card p-6">
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="jalsarathi-card p-6 text-center">
          <div className="text-3xl mb-3">💧</div>
          <h3 className="font-semibold text-gray-900 mb-2">Rainwater Harvesting</h3>
          <p className="text-gray-600 text-sm">
            Calculate potential water savings and ROI for your property with 
            location-specific rainfall data.
          </p>
        </div>
        
        <div className="jalsarathi-card p-6 text-center">
          <div className="text-3xl mb-3">⚗️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Water Quality</h3>
          <p className="text-gray-600 text-sm">
            Test water quality and identify contamination risks with our 
            comprehensive analysis tools.
          </p>
        </div>
        
        <div className="jalsarathi-card p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Analytics</h3>
          <p className="text-gray-600 text-sm">
            Get detailed reports and recommendations based on scientific 
            calculations and government guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;