import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">JalSarathi</h3>
            <p className="text-gray-400">
              Smart water management solution for sustainable living and 
              environmental conservation.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#rainwater" className="hover:text-white transition-colors">Rainwater Calculator</a></li>
              <li><a href="#water-quality" className="hover:text-white transition-colors">Water Quality Test</a></li>
              <li><a href="#admin" className="hover:text-white transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-gray-400 space-y-2">
              <p>Smart India Hackathon 2025</p>
              <p>Team JalSarathi</p>
              <p>PS ID: 25065 & 25067</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2025 JalSarathi. All rights reserved. Built for a sustainable future.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;