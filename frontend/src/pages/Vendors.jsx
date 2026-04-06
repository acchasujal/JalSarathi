import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, Phone } from "lucide-react";
import { getVendors } from "../services/api";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendors()
      .then(data => {
        if (data && data.length > 0) {
          setVendors(data);
        } else {
          setVendors([
            { id: 'fb1', name: "EcoRain Solutions", city: "Delhi", phone: "9876543210", rating: 4.8 },
            { id: 'fb2', name: "AquaHarvest Systems", city: "Mumbai", phone: "9823456712", rating: 4.6 },
            { id: 'fb3', name: "RainSmart Technologies", city: "Bangalore", phone: "9898123456", rating: 4.9 }
          ]);
        }
      })
      .catch(() => {
        setVendors([
          { id: 'fb1', name: "EcoRain Solutions", city: "Delhi", phone: "9876543210", rating: 4.8 }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">🌦️ Certified Vendors</h1>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500 flex justify-center items-center gap-3">
          <div className="w-6 h-6 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          Loading Vendors...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-0">
          {vendors.map((v, i) => (
            <motion.div
              key={v.id || i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-sky-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-sky-50 rounded-full flex justify-center items-center mb-4">
                <Store className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{v.name}</h3>
              <p className="text-gray-500 text-sm mb-3">{v.city}</p>
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-amber-500 flex items-center justify-center gap-1">
                  ⭐ <span className="text-gray-700 ml-1">{v.rating} / 5.0</span>
                </p>
                <p className="text-sm flex items-center justify-center gap-2 font-medium text-sky-600 bg-sky-50 py-2 rounded-lg mt-1">
                  <Phone size={14} /> {v.phone}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsPage;

