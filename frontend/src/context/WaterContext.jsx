import React, { createContext, useContext, useState } from 'react';

const WaterContext = createContext();

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};

export const WaterProvider = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentsHistory, setAssessmentsHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('rainwater');

  const addAssessment = (assessment) => {
    setCurrentAssessment(assessment);
    setAssessmentsHistory(prev => [assessment, ...prev.slice(0, 9)]);
  };

  const value = {
    currentAssessment,
    assessmentsHistory,
    activeTab,
    setActiveTab,
    addAssessment,
    setCurrentAssessment
  };

  return (
    <WaterContext.Provider value={value}>
      {children}
    </WaterContext.Provider>
  );
};