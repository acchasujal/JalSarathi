# JalSarathi 💧 - Your Personal Water Conservation Advisor


JalSarathi is an open-source web application for on-the-spot assessment of Rooftop Rainwater Harvesting (RTRWH) and Artificial Recharge (AR) potential in India. It transforms complex geospatial and hydrological data into simple, actionable insights for every citizen.

🚀([JalSarathi](https://jal-sarathi.vercel.app/))
The Problem 🏜️
India is facing a critical groundwater crisis, with aquifers depleting at an alarming rate. While the government provides a wealth of scientific data on water conservation, it remains locked in complex reports, inaccessible to the general public. This "Information-Action" gap prevents widespread citizen participation in vital water-saving initiatives.

The Solution ✨
JalSarathi bridges this gap. It is a digital public utility that empowers every individual to become a water warrior. By simply providing a location, users get a comprehensive, scientifically-backed report on their property's water harvesting potential, helping them make informed decisions to conserve water and secure their future.

Key Features 🎯

📍 On-the-Spot GIS-Based Assessment: Get an instant analysis of your location's potential using real-time geospatial data.

💧 Dual Potential Analysis: Calculates potential for both Rooftop Rainwater Harvesting (RTRWH) and Artificial Recharge (AR) from open spaces.

🔬 Automated Feasibility Check: Automatically checks for critical parameters like soil permeability, land slope, and groundwater depth to determine site suitability for AR.   

🏗️ Intelligent Structure Recommendations: Suggests the most appropriate type of structure (e.g., Recharge Pit, Storage Tank) with recommended dimensions tailored to your site's conditions.   

💰 Cost & Benefit Analysis: Provides an estimated cost for the proposed structure and a clear analysis of potential water and monetary savings.

📜 Policy-Aware Guidance: Informs users about local and state-level rainwater harvesting mandates and incentives.   

🌐 Multi-Lingual Support: Designed to be accessible to diverse communities across India.

🛠️ Technology Stack & Architecture
JalSarathi is built using a modern, scalable tech stack. The architecture is designed to be robust, ensuring that the application can handle complex geospatial queries efficiently.

Architecture Overview
The application follows a standard client-server model. The frontend captures user inputs, the backend orchestrates data from multiple sources, performs the analysis, and returns a comprehensive report.

(You can add an architecture diagram here in the docs/ folder and link it)

# Tech Stack: Node.js Backend (Full-Stack JavaScript)

| Component     | Technology                              | Rationale                                                                 |
|--------------|------------------------------------------|---------------------------------------------------------------------------|
| UI           | React.js, OpenLayers, Material-UI        | A unified JavaScript ecosystem simplifies development and team workflow. |
| Backend       | Node.js (Express.js)                    | High-performance, non-blocking I/O is excellent for handling concurrent API requests to data sources. |
| Data Handling | Danfo.js, Turf.js, Axios                | Modern JS libraries for data manipulation (Danfo.js) and spatial features (Turf.js). |
| Database      | PostgreSQL + PostGIS                    | Remains the best choice for storing and querying the complex geospatial data. |
| Data Sources  | ISRO Bhuvan (WMS), IMD, CGWB            | Same data integration strategy, using Axios for live WMS queries and a PostgreSQL DB for cached data. |


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
