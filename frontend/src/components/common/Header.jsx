import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JalSarathi</h1>
              <p className="text-sm text-gray-600">Smart Water Management</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Water Calculator
            </Link>
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;