# Technical Specifications (Tech Specs)

## 1. Architecture Breakdown
JalSarathi is built on a modern JavaScript-based Single Page Application (SPA) architecture, decoupled into a distinct frontend client and backend API.

- **Frontend (Client-Side):**
  - **Framework:** React 18 powered by Vite for rapid development and optimized builds.
  - **Styling:** Vanilla Tailwind CSS with a strict design system (`bg-sky-50`, `text-gray-900`, `font-inter`).
  - **Animation/Visualization:** Framer Motion for micro-interactions and smooth page transitions; Recharts for responsive chart rendering.
  - **Routing:** React Router DOM (v6) for client-side navigation.
  - **Deployment:** Vercel.

- **Backend (Server-Side):**
  - **Framework:** Node.js with Express.js.
  - **Capabilities:** RESTful API architecture providing calculation endpoints, business logic, data seeding, and PDF report generation (via `pdfkit`).
  - **Database:** SQLite (dev/local fallback) adapting towards PostgreSQL for robust production use.
  - **Deployment:** Render.

## 2. Component Hierarchy (Frontend)
The React application follows a modular, feature-based directory structure:
```text
App
 ├── Header
 ├── AnimatedRoutes (Framer Motion wrapped routing)
 │    ├── HomePage (PS1/PS2 navigation anchor)
 │    │    ├── Layout Components
 │    │    ├── RWH Modules (PS1 Calculators, Charts)
 │    │    └── Water Quality Modules (PS2 Forms, HPI Charts)
 │    ├── VendorsPage (Vendor List & Services)
 │    └── SubsidiesPage (Government Subsidy directory)
 └── Footer
```
*Note: Components utilize a shared `/components/layout/` and modular architecture (`/components/rwh/`, `/components/water-quality/`) to maximize reusability.*

## 3. Database Schema Design
Currently reliant on static JSON and local SQLite. The schema design preparing for PostgreSQL migration consists of:

- **Locations:** Store geospatial configuration.
  - `id` (UUID/PK), `city_name` (String), `state` (String), `avg_rainfall_mm` (Float), `lat` (Float), `lng` (Float).
- **Assessments (PS1):** Logged user calculations.
  - `id` (UUID/PK), `user_id` (FK/Optional), `location_id` (FK), `rooftop_area` (Float), `total_harvest` (Float), `created_at` (Timestamp).
- **WaterQualityLogs (PS2):** Heavy metal test evaluations.
  - `id` (UUID/PK), `location_id` (FK), `hpi_score` (Float), `arsenic_lvl` (Float), `lead_lvl` (Float), `created_at` (Timestamp).
- **Vendors:** System vetted implementers.
  - `id` (UUID/PK), `name` (String), `service_area` (String), `contact_info` (JSON), `rating` (Float).

## 4. External API Dependencies
1. **Open-Meteo API:** A REST API for retrieving free historical, current, and forecasted weather data. To be used to dynamically fetch live rain data instead of relying on static city averages.
2. **Leaflet (React-Leaflet):** An open-source maps library utilized for GIS interfaces, allowing the user to select precise geolocations to drive both rainwater and quality calculations.
