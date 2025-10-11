import React from "react";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";

const subsidies = [
  { name: "Delhi Jal Board Scheme", desc: "Up to ₹50,000 for residential rainwater systems.", type: "Urban" },
  { name: "Maharashtra RWH Grant", desc: "30% subsidy on rooftop systems.", type: "Urban" },
  { name: "Rural Water Mission", desc: "₹25,000 assistance for rural rainwater harvesting.", type: "Rural" }
];

const SubsidiesPage = () => {
  return (
    <div className="max-w-5xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">🏛️ Government Subsidies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subsidies.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="jalsarathi-card p-5"
          >
            <Landmark className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">{s.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{s.desc}</p>
            <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{s.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubsidiesPage;
