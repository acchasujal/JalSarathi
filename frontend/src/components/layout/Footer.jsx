import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">JalSarathi</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering communities with smart water management tools for 
              a sustainable and water-secure future.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Solutions</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Rainwater Harvesting</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Water Quality Analysis</Link></li>
              <li><Link to="/vendors" className="hover:text-blue-400 transition-colors">Certified Vendors</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Resources</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/subsidies" className="hover:text-blue-400 transition-colors">Govt. Subsidies</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Project Info</h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p className="font-medium text-gray-300">SIH 2025</p>
              <p>Team JalSarathi</p>
              <p className="text-xs opacity-75">PS ID: 25065 & 25067</p>
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