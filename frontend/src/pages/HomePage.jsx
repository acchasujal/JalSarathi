import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RainwaterCalculator from "../components/rwh/RainwaterCalculator";
import WaterQualityTester from "../components/water-quality/WaterQualityTester";
import { useWater } from "../context/WaterContext";
import { Droplet, FlaskConical, BarChart3, Leaf } from "lucide-react";

const HomePage = () => {
  const { activeTab, setActiveTab } = useWater();

  const tabs = [
    { id: "rainwater", name: "🌧️ Rainwater Calculator", component: RainwaterCalculator },
    { id: "water-quality", name: "⚗️ Water Quality Test", component: WaterQualityTester },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="max-w-6xl mx-auto">
      {/* 🌊 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 rounded-3xl py-12 px-6 text-center shadow-sm border border-blue-100 mb-12"
      >
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
          JalSarathi <span className="text-cyan-600">Water Management</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Empowering communities to make informed water decisions through 
          smart tools, data-driven insights, and sustainability initiatives.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition"
          onClick={() => setActiveTab("rainwater")}
        >
          Start Exploring
        </motion.button>
      </motion.section>

      {/* 🧭 Tabs Navigation */}
      <nav className="flex flex-wrap justify-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 sm:flex-none py-3 px-5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            {tab.name}
          </motion.button>
        ))}
      </nav>

      {/* ⚙️ Dynamic Tab Content */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 📊 Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          {
            icon: <Droplet className="w-10 h-10 text-blue-500 mx-auto mb-3" />,
            title: "Rainwater Harvesting",
            text: "Estimate water savings and ROI using regional rainfall data and property size.",
          },
          {
            icon: <FlaskConical className="w-10 h-10 text-blue-500 mx-auto mb-3" />,
            title: "Water Quality Analysis",
            text: "Identify contamination risks and assess potability using test-based insights.",
          },
          {
            icon: <BarChart3 className="w-10 h-10 text-blue-500 mx-auto mb-3" />,
            title: "Smart Analytics",
            text: "Visualize water usage trends and sustainability metrics across time.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {card.icon}
            <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.text}</p>
          </motion.div>
        ))}
      </section>

      {/* 🌿 CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-3xl py-12 text-center shadow-md"
      >
        <Leaf className="w-10 h-10 mx-auto mb-3 text-white opacity-80" />
        <h2 className="text-2xl font-semibold mb-2">Join the Water Revolution 🌏</h2>
        <p className="text-blue-50 mb-6">
          Adopt sustainable practices and make every drop count with JalSarathi.
        </p>
        <a
          href="/vendors"
          className="inline-block bg-white text-blue-700 font-medium px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition"
        >
          Explore Vendors
        </a>
      </motion.section>
    </div>
  );
};

export default HomePage;

