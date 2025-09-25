import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { WaterProvider } from './context/WaterContext';
import './styles/App.css';

function App() {
  return (
    <WaterProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WaterProvider>
  );
}

export default App;