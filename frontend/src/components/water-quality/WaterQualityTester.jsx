import React, { useState } from "react";
import { FlaskConical, AlertTriangle, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const WaterQualityTester = () => {
  const [formData] = useState({
    lead: "",
    arsenic: "",
    mercury: "",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12 px-6 flex flex-col items-center"
    >
      <div className="text-sky-500 mb-4">
        <FlaskConical className="w-14 h-14 drop-shadow-md" />
      </div>

      <h2 className="text-3xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <Droplets className="w-6 h-6 text-blue-500" />
        Water Quality Tester
      </h2>

      <p className="text-gray-600 max-w-md text-center mb-8">
        Analyze heavy metal contamination like <strong>Lead (Pb)</strong>,{" "}
        <strong>Arsenic (As)</strong>, and <strong>Mercury (Hg)</strong> — coming soon!
      </p>

      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 rounded-2xl p-6 max-w-md w-full shadow-sm text-yellow-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Feature Coming Soon</h4>
            <p className="text-sm leading-relaxed">
              This module will enable testing water samples for heavy metals and display contamination safety levels.
              Currently, JalSarathi focuses on <strong>Rainwater Harvesting</strong> for the MVP.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm italic">
        Stay tuned — launching in the next release 🚀
      </div>
    </motion.div>
  );
};

export default WaterQualityTester;
