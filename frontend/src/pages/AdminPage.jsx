import React, { useEffect, useState } from "react";
import { getAdminStats } from "../services/api";
import { motion } from "framer-motion";
import { Droplets, FlaskConical, BadgeDollarSign } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
  >
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mb-3`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-3xl font-bold text-gray-800">{value ?? "—"}</h3>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </motion.div>
);

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-sky-700 mb-6">
        🧭 Admin Dashboard
      </h1>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading statistics...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Droplets}
            label="Rainwater Assessments"
            value={stats.rainwaterRecords}
            color="blue"
          />
          <StatCard
            icon={FlaskConical}
            label="Water Quality Tests"
            value={stats.waterTests}
            color="emerald"
          />
          <StatCard
            icon={BadgeDollarSign}
            label="Subsidies Processed"
            value={stats.subsidies}
            color="amber"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-6">
          ⚠️ Unable to load dashboard data.
        </div>
      )}
    </motion.div>
  );
}

