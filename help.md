Repository Structure
aquaminds-mvp/
├── frontend/                 # React Vite application
│   ├── public/              # Static assets
│   │   ├── icons/
│   │   └── demo-data/       # Pre-loaded location data
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Form, Card, Modal (PS1 + PS2 reusable)
│   │   │   ├── rwh/         # Rainwater-specific components
│   │   │   └── water-quality/ # Heavy metal components
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # API calls, calculations
│   │   ├── utils/           # Helpers, constants, formatters
│   │   ├── hooks/           # Custom React hooks
│   │   └── styles/          # Global styles, theme
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js Express API
│   ├── controllers/         # Route handlers
│   ├── models/              # Data models
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, validation, etc.
│   ├── services/            # Business logic
│   ├── utils/               # PDF generation, calculations
│   ├── data/                # Demo data JSON files
│   ├── config/              # Database, environment config
│   ├── tests/               # API tests
│   ├── package.json
│   └── server.js
├── shared/                   # Shared resources
│   ├── designs/             # Figma exports, assets
│   ├── docs/                # Project documentation
│   └── scripts/             # Deployment/build scripts
├── .github/                  # GitHub workflows
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
├── docker-compose.yml        # Local development
├── .env.example             # Environment template
├── .gitignore
└── README.md

Prerequisites & Required Tools
bash
# All team members
- Node.js 18+ & npm
- Git
- VS Code (recommended)

# VS Code Extensions (recommended)
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Prettier - Code formatter
- Thunder Client (API testing)
- GitLens

# Backend specific
- Thunder Client (API testing)
- SQLite Viewer (if needed)

# Frontend specific
- React Developer Tools (browser extension)
Environment Setup
bash
# 1. Clone and setup
git clone <repository-url>
cd aquaminds-mvp

# 2. Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# 4. Verify setup
# Backend: http://localhost:3001
# Frontend: http://localhost:5173
👥 Role-Based Task Breakdown
Frontend Developer (2 team members)
markdown
## Phase 1: Foundation
- [ ] Setup React Vite project with Tailwind CSS
- [ ] Create basic layout component structure
- [ ] Implement routing between PS1/PS2 tabs
- [ ] Create reusable Form, Card, and Modal components

## Phase 2: PS1 Features (Rainwater)
- [ ] Property input form with location dropdown
- [ ] Results display component with charts
- [ ] PDF report generation component
- [ ] Admin dashboard view

## Phase 3: PS2 Readiness
- [ ] Heavy metal input form component
- [ ] Contamination results display
- [ ] Map integration component (Leaflet)

## Phase 4: Polish
- [ ] Mobile responsiveness
- [ ] Loading states and error handling
- [ ] Demo data pre-loading
Backend Developer (2 team members)
markdown
## Phase 1: API Foundation
- [ ] Setup Express.js server with CORS
- [ ] SQLite database configuration
- [ ] Basic CRUD API endpoints
- [ ] Error handling middleware

## Phase 2: Calculation Services
- [ ] Rainwater harvesting algorithms (CGWB formulas)
- [ ] Heavy metal index calculators (HPI/HEI)
- [ ] Subsidy calculation logic
- [ ] Demo data seeding (20 locations)

## Phase 3: Advanced Features
- [ ] PDF report generation service
- [ ] Vendor/subsidy data management
- [ ] Admin API endpoints
- [ ] Data validation middleware

## Phase 4: Integration
- [ ] Frontend-backend API integration
- [ ] Performance optimization
- [ ] Basic authentication (if time)
UI/UX Designer (1 team member)
markdown
## Phase 1: Design System
- [ ] Export Figma components as SVG/assets
- [ ] Create color palette and typography scale
- [ ] Design reusable component library

## Phase 2: Page Designs
- [ ] Main calculator interface (PS1)
- [ ] Water quality interface (PS2)
- [ ] Admin dashboard layout
- [ ] Mobile-responsive designs

## Phase 3: Assets & Polish
- [ ] Icons and illustrations
- [ ] PDF report template design
- [ ] Demo data visualization mockups

## Phase 4: Collaboration
- [ ] Work with frontend on implementation
- [ ] Conduct usability reviews
- [ ] Create presentation assets
Admin/DevOps (1 team member)
markdown
## Phase 1: Project Setup
- [ ] GitHub repository configuration
- [ ] Branch protection rules
- [ ] Development environment setup
- [ ] Docker configuration for local dev

## Phase 2: Deployment Ready
- [ ] Vercel/Railway deployment config
- [ ] Environment variable management
- [ ] Build and deployment scripts
- [ ] Basic monitoring setup

## Phase 3: Quality Assurance
- [ ] Code formatting/prettier setup
- [ ] Basic test configuration
- [ ] Performance benchmarking
- [ ] Security checklist

## Phase 4: Demo Preparation
- [ ] Production deployment
- [ ] Demo data population
- [ ] Backup deployment ready
- [ ] Presentation environment setup
🚀 Quick Start Commands
Development Workflow
bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)  
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
cd backend && npm start
Team Collaboration
bash
# Feature development
git checkout -b feature/rainwater-calculator
git add .
git commit -m "feat: add rainwater calculation form"
git push origin feature/rainwater-calculator

# Code review & merge
# Create Pull Request → Review → Merge to main
✅ Final Implementation Checklist

