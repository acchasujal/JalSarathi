# JalSarathi 💧 - Your Personal Water Conservation Advisor


JalSarathi is an open-source web application for on-the-spot assessment of Rooftop Rainwater Harvesting (RTRWH) and Artificial Recharge (AR) potential in India. It transforms complex geospatial and hydrological data into simple, actionable insights for every citizen.

🚀([JalSarathi](https://jal-sarathi.vercel.app/))

🌍 The Problem

India faces a growing groundwater crisis due to over-extraction, urbanization, and erratic rainfall.
Although rainwater harvesting is mandated or recommended in many regions, citizens lack easy tools to understand:

How much rainwater they can realistically harvest
Whether it is financially viable
How much of their household water demand it can meet

✨ The Solution

JalSarathi bridges this gap by providing a simple, location-aware calculator that estimates:
Annual harvestable rainwater
Potential cost savings
Payback period of a rainwater harvesting system
Percentage of household demand met
Subsidy-adjusted system cost
All calculations are tailored to Indian cities and standards.

🎯 Current Features (Implemented)

📍 City-wise Rainfall Estimation
Uses predefined Indian city rainfall averages as a reliable baseline.
🏠 Rooftop-Based Calculation
Considers rooftop area, roof material, household size, and location type.
💧 Annual Harvest Potential
Calculates total harvestable rainwater using standard runoff coefficients.
💰 Cost & Payback Analysis
Estimates system cost, annual savings, subsidy benefits, and payback period.
📊 Interactive Visualizations
Bar charts, pie charts, and comparison graphs for better understanding.
📄 Downloadable PDF Report
Generates a structured rainwater assessment report.

🌐 Full-Stack Deployment

Frontend: Vercel
Backend API: Render

🛠️ Tech Stack
Frontend:
React (Vite)
Tailwind CSS
Recharts
Framer Motion
Axios

Backend:
Node.js + Express
SQLite (for assessment logging)
PDFKit (report generation)

Deployment:
Frontend: Vercel
Backend: Render

🧠 Architecture Overview

React frontend collects user inputs
Backend REST API performs calculations
Results returned as JSON
Charts rendered client-side
PDF generated server-side

🚧 Roadmap / Planned Enhancements

These features are planned but not yet implemented:
🌧️ Live rainfall data from IMD / Open-Meteo
🗺️ GIS-based analysis using OpenLayers
💧 Artificial groundwater recharge estimation
📜 State-wise subsidy & policy mapping
🗣️ Multi-lingual support
🧮 Advanced feasibility checks (soil, slope, aquifer depth)
🗄️ Migration to PostgreSQL + PostGIS

🏁 Getting Started & Local Setup
Follow these steps to set up and run the project on your local machine.

1. Clone the repository:

Bash

git clone https://github.com/acchasujal/JalSarathi.git
cd JalSarathi

2. Setup the Backend:

Bash

cd backend
npm install
npm start

3. Setup the Frontend:
   
Bash

cd frontend
npm install
npm run dev

The application should now be running on http://localhost:3000.

🤝 How to Contribute
We welcome contributions from the community! Whether it's fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

Please read our (CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

📄 License
This project is licensed under the MIT License - see the (LICENSE) file for details.

🙏 Acknowledgments & Data Sources
This project would not be possible without the open data provided by Indian government agencies. We extend our sincere gratitude to:

Central Ground Water Board (CGWB): For groundwater level and aquifer data.   

India Meteorological Department (IMD): For historical and gridded rainfall data.   

ISRO's Bhuvan Platform: For providing rich thematic geospatial data via OGC services.   

National Institute of Hydrology (NIH): For foundational research on artificial recharge practices.   
