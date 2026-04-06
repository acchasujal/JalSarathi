import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Lightbulb, MapPin, Calculator, Beaker } from "lucide-react";

// Simple icon for completion
const CheckCircle = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/**
 * GuidedTour Component
 * A premium, interactive onboarding overlay for JalSarathi.
 */
const GuidedTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to JalSarathi",
      description: "We help you manage water smarter. Let's show you how to get the most accurate results in just 30 seconds.",
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
      highlight: null,
    },
    {
      title: "1. Precision Map Pin",
      description: "Don't just type a city! Tap the Map Pin icon to drop a precise location. This fetches hyper-local satellite rainfall data for your exact roof.",
      icon: <MapPin className="w-8 h-8 text-sky-500" />,
      highlight: "map-pin-button",
    },
    {
      title: "2. Rooftop Details",
      description: "Enter your rooftop area in square meters. We use this with the annual rainfall to calculate how many thousands of liters you can save.",
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      highlight: "rooftop-input",
    },
    {
      title: "3. Water Quality Testing",
      description: "Switch to the Water Quality tab to check for heavy metals. Enter your lab results (Lead, Arsenic, Mercury) to see your safety index.",
      icon: <Beaker className="w-8 h-8 text-purple-500" />,
      highlight: "quality-tab",
    },
    {
      title: "Ready to Start?",
      description: "You're all set! Use the 'Download PDF' button after calculating to save your official water assessment report.",
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      highlight: null,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-hidden border border-sky-100 flex flex-col m-4"
        >
          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 flex-grow overflow-y-auto custom-scrollbar">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center gap-6 mt-4">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-sky-50 rounded-2xl"
              >
                {steps[currentStep].icon}
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Footer Controls */}
          <div className="p-6 sm:p-8 pt-0 border-t border-gray-50 bg-white/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
              {/* Progress Dots */}
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? "w-6 bg-sky-500" : "w-1.5 bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                    currentStep === 0 ? "text-gray-300" : "text-gray-500 hover:text-sky-600"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={nextStep}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-100 active:scale-95 group"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GuidedTour;
