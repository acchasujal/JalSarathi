import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalculatorForm from './CalculatorForm';
import ResultsDisplay from './ResultsDisplay';
import { useWater } from '../../context/WaterContext';

const RainwaterCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoLocations, setDemoLocations] = useState([]);
  const { currentAssessment, addAssessment } = useWater();

  useEffect(() => {
    fetchDemoLocations();
  }, []);

  const fetchDemoLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/rainwater/demo-locations');
      setDemoLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/rainwater/calculate', formData);
      
      if (response.data.success) {
        const assessment = { ...formData, ...response.data.data, timestamp: new Date() };
        addAssessment(assessment);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate rainwater potential');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (assessmentData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/rainwater/generate-pdf', {
        assessmentData: assessmentData
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'jalsarathi-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF report');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rainwater Harvesting Calculator
        </h2>
        <p className="text-gray-600">
          Calculate the potential of rainwater harvesting for your property and discover cost savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CalculatorForm 
          onSubmit={handleCalculate}
          loading={loading}
          demoLocations={demoLocations}
        />
        
        <ResultsDisplay 
          assessment={currentAssessment}
          loading={loading}
          error={error}
          onGeneratePDF={handleGeneratePDF}
        />
      </div>
    </div>
  );
};

export default RainwaterCalculator;