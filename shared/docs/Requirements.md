# Requirements Document 

## 1. Functional Requirements (FRs)

### FR1: Water Quality (PS2) Integration
- **FR1.1:** The system shall provide an input form within `/components/water-quality/` for users to enter heavy metal test levels.
- **FR1.2:** The frontend shall visualize the Heavy Metal Pollution Index (HPI) via interactive charts.
- **FR1.3:** The backend `waterQuality.js` route must accept quality parameters, calculate HPI accurately based on standard environmental formulas, and return a structured JSON assessment.
- **FR1.4:** The `HomePage.jsx` interface shall seamlessly route users to the PS2 module.

### FR2: Live Weather Data Integration
- **FR2.1:** The backend shall integrate the Open-Meteo API to fetch real-time and historical rainfall data relative to a user's location.
- **FR2.2:** The system shall cache API responses for a specified duration (e.g., 24 hours) to reduce external requests and mitigate API rate limits.
- **FR2.3:** Rainwater harvesting calculations must default to live data if available, falling back to static averages if the API is unreachable.

### FR3: GIS Mapping Integration
- **FR3.1:** A map interface built with React-Leaflet shall be embedded into the frontend location selection process.
- **FR3.2:** Users shall be able to drop a pin on the map to define their coordinates.
- **FR3.3:** Dropped pin coordinates shall auto-fill the location requirements for the Rainwater calculation (PS1) or Water Quality assessment (PS2).

### FR4: Admin Dashboard Operations
- **FR4.1:** The `/admin` routes must expose CRUD (Create, Read, Update, Delete) endpoints for `vendors` and `locations` data.
- **FR4.2:** The `AdminPage.jsx` frontend interface must securely connect to these endpoints, allowing an authenticated manager to add new vendors or modify standard location baselines.

### FR5: Database Migration to PostgreSQL
- **FR5.1:** The `database.js` connection module must be configured to check for a `DATABASE_URL` environment variable.
- **FR5.2:** If `DATABASE_URL` exists, the backend shall initialize a PostgreSQL connection pool (via `pg`). If absent, it will fall back to SQLite.
- **FR5.3:** SQL queries throughout the application must be syntax-agnostic enough to run on both SQLite and PostgreSQL.

---

## 2. Non-Functional Requirements (NFRs)

### NFR1: Performance & Caching
- The API response time for calculations and DB queries must not exceed 500ms.
- 3rd party API calls (Open-Meteo) must be cached to prevent rate-limiting and ensure snappy performance.

### NFR2: UI/UX & Thematic Adherence
- The application *must strictly* enforce the existing visual theme: deep use of `bg-sky-50`, textual items set to `text-gray-900`, and all typography utilizing `font-inter`.
- Interactions and state changes must utilize Framer Motion for micro-animations (e.g. smooth page transitions).
- Components should be reusable wherever logical.

### NFR3: Maintainability
- The codebase shall adhere to ES6+ standards and pure modular architecture.
- Reusable UI elements (Buttons, Inputs, Cards) should not contain heavy business logic.
- New dependencies should be evaluated strictly against bundle size and architectural necessity.

### NFR4: Security
- Admin endpoints must not be exposed to unauthenticated users.
- Form inputs across PS1 and PS2 must be aggressively sanitized to prevent basic injection attacks.
