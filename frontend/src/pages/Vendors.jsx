import React from "react";
import { motion } from "framer-motion";
import { Store, Phone } from "lucide-react";

const vendors = [
  { name: "EcoRain Solutions", city: "Delhi", phone: "9876543210", rating: 4.8 },
  { name: "AquaHarvest Systems", city: "Mumbai", phone: "9823456712", rating: 4.6 },
  { name: "RainSmart Technologies", city: "Bangalore", phone: "9898123456", rating: 4.9 }
];

const VendorsPage = () => {
  return (
    <div className="max-w-5xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">🌦️ Certified Vendors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vendors.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="jalsarathi-card p-5 text-center"
          >
            <Store className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">{v.name}</h3>
            <p className="text-gray-500">{v.city}</p>
            <p className="text-sm mt-1 text-gray-700">⭐ {v.rating}</p>
            <p className="text-sm flex items-center justify-center gap-1 mt-2 text-blue-600">
              <Phone size={14} /> {v.phone}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorsPage;

