import React from "react";
import { Droplet, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <Droplet className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-gray-800 text-lg">JalSarathi</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/vendors" className="hover:text-blue-600 transition">Vendors</Link>
          <Link to="/subsidies" className="hover:text-blue-600 transition">Subsidies</Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;

