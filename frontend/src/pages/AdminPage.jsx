import React, { useEffect, useState } from "react";
import { getAdminStats, getVendors, addVendor, deleteVendor, getLocations, addLocation, deleteLocation } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, FlaskConical, BadgeDollarSign, MapPin, Store, Trash2 } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
  >
    <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mb-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-3xl font-bold text-gray-800">{value ?? "—"}</h3>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </motion.div>
);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [newVendor, setNewVendor] = useState({ name: "", city: "", phone: "", rating: "" });
  const [newLocation, setNewLocation] = useState({ name: "", rainfall: "", type: "urban" });

  useEffect(() => {
    if (activeTab === "stats") {
      getAdminStats().then(setStats).catch(() => setStats(null));
    } else if (activeTab === "vendors") {
      getVendors().then(setVendors).catch(console.error);
    } else if (activeTab === "locations") {
      getLocations().then(setLocations).catch(console.error);
    }
  }, [activeTab]);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const added = await addVendor(newVendor);
      setVendors([...vendors, added]);
      setNewVendor({ name: "", city: "", phone: "", rating: "" });
    } catch (err) { alert("Failed to add vendor"); }
  };

  const handleDeleteVendor = async (id) => {
    try {
      await deleteVendor(id);
      setVendors(vendors.filter(v => v.id !== id));
    } catch (err) { alert("Failed to delete vendor"); }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const added = await addLocation(newLocation);
      setLocations([...locations, added]);
      setNewLocation({ name: "", rainfall: "", type: "urban" });
    } catch (err) { alert("Failed to add location"); }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter(l => l.id !== id));
    } catch (err) { alert("Failed to delete location"); }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-sky-700 mb-8 flex items-center gap-3">
        🧭 Admin Dashboard
      </h1>

      <div className="flex gap-4 mb-8 border-b pb-4 overflow-x-auto">
        {["stats", "vendors", "locations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-medium transition capitalize whitespace-nowrap ${activeTab === tab ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700 hover:bg-sky-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={Droplets} label="Rainwater Assessments" value={stats?.rainwaterRecords} color="blue" />
            <StatCard icon={FlaskConical} label="Water Quality Tests" value={stats?.waterTests} color="emerald" />
            <StatCard icon={BadgeDollarSign} label="Subsidies Processed" value={stats?.subsidies} color="amber" />
          </motion.div>
        )}

        {activeTab === "vendors" && (
          <motion.div key="vendors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Store className="text-sky-500"/> Add New Vendor</h2>
              <form onSubmit={handleAddVendor} className="space-y-4">
                <input required type="text" placeholder="Vendor Name" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <input required type="text" placeholder="City" value={newVendor.city} onChange={e => setNewVendor({...newVendor, city: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <input required type="text" placeholder="Phone" value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <input required type="number" step="0.1" placeholder="Rating (1-5)" value={newVendor.rating} onChange={e => setNewVendor({...newVendor, rating: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 transition text-white p-3 rounded-xl font-medium">Add Vendor</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto max-h-[500px]">
              <h2 className="text-xl font-semibold mb-4 text-sky-900">Current Vendors</h2>
              <div className="space-y-4">
                {vendors.map(v => (
                  <div key={v.id} className="flex justify-between items-center p-4 bg-sky-50 rounded-xl border border-sky-100 shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800 tracking-tight">{v.name} <span className="text-sm font-normal text-amber-500">⭐ {v.rating}</span></p>
                      <p className="text-sm text-gray-600 mt-1"><span className="font-medium text-sky-700">{v.city}</span> | {v.phone}</p>
                    </div>
                    <button onClick={() => handleDeleteVendor(v.id)} className="text-red-500 hover:bg-red-50 p-2 border border-transparent hover:border-red-100 rounded-lg transition"><Trash2 className="w-5 h-5"/></button>
                  </div>
                ))}
                {vendors.length === 0 && <p className="text-gray-500">No vendors found. Please add one.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "locations" && (
          <motion.div key="locations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><MapPin className="text-sky-500"/> Add Custom Location Overrides</h2>
              <form onSubmit={handleAddLocation} className="space-y-4">
                <input required type="text" placeholder="Location Name" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <input required type="number" placeholder="Hardcoded Rainfall Baseline (mm)" value={newLocation.rainfall} onChange={e => setNewLocation({...newLocation, rainfall: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                <select value={newLocation.type} onChange={e => setNewLocation({...newLocation, type: e.target.value})} className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none">
                  <option value="urban">Urban</option>
                  <option value="rural">Rural</option>
                  <option value="semi-arid">Semi-Arid</option>
                </select>
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 transition text-white p-3 rounded-xl font-medium">Add Location Override</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto max-h-[500px]">
              <h2 className="text-xl font-semibold mb-4 text-sky-900">Location Overrides</h2>
              <div className="space-y-4">
                {locations.map(l => (
                  <div key={l.id} className="flex justify-between items-center p-4 bg-sky-50 rounded-xl border border-sky-100 shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{l.name} <span className="text-sm font-medium text-sky-600 bg-white border border-sky-100 px-2 py-0.5 rounded text-xs ml-2 capitalize">{l.type}</span></p>
                      <p className="text-sm text-gray-600 mt-1">{l.rainfall} mm average rainfall</p>
                    </div>
                    <button onClick={() => handleDeleteLocation(l.id)} className="text-red-500 hover:bg-red-50 p-2 border border-transparent hover:border-red-100 rounded-lg transition"><Trash2 className="w-5 h-5"/></button>
                  </div>
                ))}
                {locations.length === 0 && <p className="text-gray-500 text-sm border border-dashed border-gray-200 p-4 rounded-xl">No custom locations override standard APIs. Open-Meteo handles dynamic default geocoding currently.</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
