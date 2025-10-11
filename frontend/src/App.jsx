import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./pages/HomePage";
import VendorsPage from "./pages/Vendors";
import SubsidiesPage from "./pages/Subsidies";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./styles/index.css"; // Make sure Tailwind is imported

// Smooth animated page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="max-w-7xl mx-auto w-full min-h-[80vh] pt-24 px-4 pb-12"
  >
    {children}
  </motion.div>
);

// Animated route transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/vendors"
          element={
            <PageWrapper>
              <VendorsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/subsidies"
          element={
            <PageWrapper>
              <SubsidiesPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Main App component (⚠️ removed BrowserRouter)
const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50 text-gray-900 font-inter">
      <Header />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;




