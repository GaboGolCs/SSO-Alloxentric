# SSO Web Application - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd sso-web
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env

# Edit .env and set your API endpoint:
# VITE_API_BASE_URL=http://localhost:8000/v1
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

## Login Credentials

Use the demo credentials shown on the login page:
- **Email**: admin@empresa.com
- **Password**: password123

These connect to your backend API at `http://localhost:8000/v1/auth/login`

## Available Scripts

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure Overview

```
src/
├── components/          # Reusable UI components
├── features/           # Feature modules (dashboard, incidents, alerts, reports)
├── lib/                # Utilities (API client, query client, helpers)
├── store/              # Zustand state stores (auth, UI)
├── types/              # TypeScript interfaces
├── pages/              # Page components (login)
├── App.tsx             # Router configuration
└── main.tsx            # Entry point
```

## Key Routes

- `/login` - Login page (public)
- `/dashboard` - Command center with heat map and KPIs
- `/incidents` - Incident management with list and filters
- `/incidents/:id` - Incident detail view
- `/alerts` - Alert center with statistics
- `/reports` - Report generation and export history

## Core Features

### Dashboard (`/dashboard`)
- Heat map visualization of plant zones
- 4 KPI cards with trend indicators
- Critical areas ranking (top 5)
- Risk trend chart with dual Y-axes
- Period selector (1D, 7D, 30D)

### Incidents (`/incidents`)
- Searchable, filterable incident list
- Quick filter chips (status, type, IAP)
- Pagination support
- Full detail view with:
  - Photo display
  - Status management
  - Corrective actions
  - Comments thread
  - Timeline history

### Alerts (`/alerts`)
- Real-time alert statistics
- Type-based filtering (IAP, SLA, Zone, Auto, Manual)
- Quick resolve functionality
- Manual alert creation modal
- Links to related incidents

### Reports (`/reports`)
- Template selection with preview
- Configurable export (format, date range, area filter)
- Async export with real-time status polling
- Download history with file details

## API Integration

The application expects these endpoints:

**Authentication**
- `POST /auth/login` - Login with email/password

**Dashboard**
- `GET /dashboard/heatmap?period=7d` - Zone data
- `GET /dashboard/kpis?period=30d` - Key metrics
- `GET /dashboard/trends?days=7` - Historical trends
- `GET /dashboard/top-areas?limit=5&period=7d` - Critical areas

**Incidents**
- `GET /incidents` - List incidents (with filters)
- `GET /incidents/:id` - Incident details
- `PATCH /incidents/:id` - Update incident
- `POST /incidents/:id/actions` - Create action
- `PATCH /incidents/:id/actions/:actionId` - Update action
- `POST /incidents/:id/comments` - Add comment

**Alerts**
- `GET /alerts` - List alerts
- `GET /alerts/stats` - Alert statistics
- `PATCH /alerts/:id` - Resolve alert
- `POST /alerts/manual` - Create manual alert

**Reports**
- `GET /reports/templates` - Available templates
- `POST /reports/export` - Start export job
- `GET /reports/export/:id` - Check job status
- `GET /reports/export-history` - Previous exports

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript 5 |
| **Build** | Vite 5 |
| **Routing** | React Router v6 |
| **State (Server)** | TanStack Query v5 |
| **State (Client)** | Zustand 4 |
| **Styling** | Tailwind CSS 3 |
| **Charts** | Recharts 2.12 |
| **HTTP** | Axios 1.7 |
| **Date** | date-fns 3.6 |
| **Icons** | lucide-react 0.383 |

## Design System

### Colors
- **Primary**: #E85A2A (Safety Orange)
- **Risk High**: #FF4757 (Red)
- **Risk Medium**: #FFA502 (Orange)
- **Risk Low**: #2ED573 (Green)
- **Background**: #0D1117 (Dark)
- **Card**: #161B22
- **Text**: #F0F6FC (Primary), #8B949E (Secondary)

### Spacing
- Card padding: p-6 (1.5rem)
- Button padding: px-4 py-2 (0.5rem 1rem)
- Gaps: gap-4 (1rem)

## State Management

### Authentication (Zustand)
```typescript
useAuthStore()
├── user: User | null
├── accessToken: string | null
├── isAuthenticated: boolean
├── setAuth(user, token)
└── clearAuth()
```

### UI (Zustand)
```typescript
useUIStore()
├── sidebarOpen: boolean
├── toggleSidebar()
└── theme: 'dark'
```

## Development Tips

### Hot Reload
- Save any file to see changes instantly
- TypeScript errors show in browser
- CSS changes apply immediately

### Debugging
- Use React DevTools Chrome extension
- TanStack Query DevTools in `/dashboard`
- Check Network tab for API calls
- Console logs for application state

### Testing API
- Inspect Network tab to verify requests
- Check request/response in browser DevTools
- Mock responses for testing without backend

## Production Build

```bash
# Create optimized build
npm run build

# Output in ./dist directory
# Ready to deploy to any static host
```

## Troubleshooting

**Blank page on startup?**
- Check that API base URL is correct in `.env`
- Open browser console for error messages
- Ensure backend server is running

**API requests failing?**
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS headers from backend
- Inspect Network tab for actual request URL

**Login not working?**
- Credentials must match backend user database
- Check API endpoint: `POST /auth/login`
- Verify response includes `user` and `access_token`

**Build fails?**
- Run `npm install` to ensure all dependencies installed
- Check TypeScript errors: `npm run lint`
- Clear node_modules and reinstall if issues persist

## Next Steps

1. Start the dev server: `npm run dev`
2. Open http://localhost:5173
3. Login with demo credentials
4. Explore each module:
   - Dashboard: View heat map and KPIs
   - Incidents: Filter and manage incidents
   - Alerts: Create and resolve alerts
   - Reports: Configure and export reports

## Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review IMPLEMENTATION_SUMMARY.md for architecture
3. Inspect browser DevTools for runtime errors
4. Check API endpoint responses in Network tab

Enjoy building the SSO industrial safety management system!
