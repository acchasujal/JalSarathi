# Product Requirements Document (PRD)

## 1. Core Value Proposition
**JalSarathi** is a comprehensive, location-aware open-source web application designed to empower Indian citizens in water conservation and management. It bridges the gap between complex hydrological data and actionable insights by calculating Rooftop Rainwater Harvesting (RTRWH) potential, assessing financial viability, and evaluating water quality indices—all wrapped in a simple, highly intuitive, and aesthetically pleasing interface.

## 2. Target Audience
- **Homeowners & Building Societies:** Looking to implement sustainable rainwater harvesting systems to offset municipal water dependency and lower costs.
- **Sustainability Enthusiasts & NGOs:** Focused on ground water recharge and community water quality monitoring.
- **Local Governments/Policy Makers:** Interested in providing an accessible tool for citizens to evaluate state-sponsored subsidies and localized harvesting constraints.

## 3. Core User Personas
### Persona 1: The Harvester (PS1)
- **Goal:** Wants to know how much rainwater they can harvest and whether the investment makes financial sense.
- **Pain Point:** Lack of transparent data on local rainfall, system costs, and applicable government subsidies.

### Persona 2: The Quality Tester (PS2)
- **Goal:** Wants to analyze local water quality and check for critical contamination (like heavy metals).
- **Pain Point:** Water quality reports are often highly technical and hard to interpret without an environmental science background.

## 4. User Journeys
### The Harvester (Phase 1 / PS1) Journey
1. **Onboarding:** User arrives at the JalSarathi home page and selects the Rainwater Harvesting module.
2. **Data Input:** User enters their property details (rooftop area, roof material, household size) and selects their location (via manual input or upcoming map pin drop).
3. **Calculation & Analysis:** JalSarathi processes the inputs against baseline city rainfall data and standard runoff coefficients.
4. **Insights Review:** User views interactive charts showing annual harvest capacity, cost-benefit analysis (payback period), and the percentage of household water demand met.
5. **Subsidy Guidance:** User reviews localized vendor options and government subsidies for implementation.
6. **Export:** User downloads a detailed PDF report summarising the assessment.

### The Quality Tester (Phase 2 / PS2) Journey
1. **Onboarding:** User navigates to the Water Quality testing interface.
2. **Location Selection:** User drops a pin or selects a location to define the assessment area.
3. **Data Input/Fetch:** User inputs lab results for specific heavy metals, or the system surfaces aggregated geospatial baseline data for the region.
4. **Visualization:** JalSarathi calculates the Heavy Metal Pollution Index (HPI) and visualizes the severity through easy-to-read charts and threat level indicators.
5. **Actionable Recommendations:** The system provides safety guidelines based on the detected contamination levels.
