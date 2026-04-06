# SSO - Sistema Integral de Gestión de Riesgos

A production-quality React web application for industrial safety management system administration.

## Features

- **Command Center / Dashboard**: Heat maps, KPIs, trend charts, and critical areas visualization
- **Incident Management**: Complete incident lifecycle management with filters, status updates, and corrective actions
- **Alert Center**: Real-time alerts with manual alert creation and resolution tracking
- **Reports & Export**: Template-based report generation with multiple formats and export history

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite 5** for fast builds and development
- **TanStack Query v5** for server-side state management
- **Zustand 4** for client-side state
- **Tailwind CSS 3** with custom dark industrial theme
- **Recharts** for data visualization
- **Axios** for HTTP requests
- **React Router v6** for client-side routing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update API base URL if needed
# VITE_API_BASE_URL=http://localhost:8000/v1
```

### Development

```bash
# Start development server
npm run dev

# Server will be available at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Badge, Card, Spinner, etc.)
│   ├── Layout.tsx      # Main app layout
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── TopBar.tsx      # Header bar
│   └── ProtectedRoute.tsx
├── features/           # Feature modules
│   ├── dashboard/      # Dashboard page and components
│   ├── incidents/      # Incident management
│   ├── alerts/         # Alert center
│   └── reports/        # Reports and exports
├── pages/              # Page components
│   └── LoginPage.tsx
├── lib/                # Utilities and helpers
│   ├── api-client.ts   # Axios configuration
│   ├── query-client.ts # TanStack Query setup
│   └── utils.ts        # Helper functions
├── store/              # Zustand stores
│   ├── auth-store.ts   # Authentication state
│   └── ui-store.ts     # UI state
├── types/              # TypeScript interfaces
│   └── index.ts
├── App.tsx             # Router configuration
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Design System

### Colors

- **Primary**: #E85A2A (Safety Orange)
- **Background**: #0D1117 (Dark)
- **Card**: #161B22 (Card Background)
- **Risk High**: #FF4757 (Red)
- **Risk Medium**: #FFA502 (Orange)
- **Risk Low**: #2ED573 (Green)
- **Text Primary**: #F0F6FC
- **Text Secondary**: #8B949E
- **Border**: #30363D

### Spacing & Rounded Corners

- Card padding: 1.5rem (p-6)
- Button padding: 0.5rem 1rem (px-4 py-2)
- Rounded corners: 8px (cards), 6px (buttons)

## API Integration

The application communicates with a backend API at `http://localhost:8000/v1`.

### Authentication

- Credentials are stored in localStorage via Zustand persist middleware
- Authorization tokens are automatically added to all requests via axios interceptor
- 401 responses redirect to login page and clear auth state

### Endpoints Used

- `POST /auth/login` - User login
- `GET /dashboard/heatmap` - Zone heat map data
- `GET /dashboard/kpis` - Key performance indicators
- `GET /dashboard/trends` - Risk trend data
- `GET /dashboard/top-areas` - Critical areas ranking
- `GET /incidents` - Incident list (paginated)
- `GET /incidents/:id` - Incident details
- `PATCH /incidents/:id` - Update incident
- `POST /incidents/:id/actions` - Create corrective action
- `POST /incidents/:id/comments` - Add comment
- `GET /alerts` - Alert list
- `GET /alerts/stats` - Alert statistics
- `PATCH /alerts/:id` - Resolve alert
- `POST /alerts/manual` - Create manual alert
- `GET /reports/templates` - Report templates
- `POST /reports/export` - Create export job
- `GET /reports/export/:id` - Export job status
- `GET /reports/export-history` - Export history

## Key Features Explained

### Dashboard (Command Center)
- Period selector for 1-day, 7-day, and 30-day views
- 4 KPI cards showing key metrics with trend indicators
- Interactive heat map of plant zones
- Critical areas ranking panel
- Risk trend chart with dual Y-axes

### Incident Management
- Filterable incident list with pagination
- Quick filter chips for status and type
- Full incident detail view with:
  - Photo display
  - Status and SLA management
  - Corrective actions tracking
  - Comment thread
  - Timeline history

### Alert Center
- Real-time alert statistics
- Type-based filtering (IAP, SLA, Zone, Auto, Manual)
- Quick alert resolution
- Modal for creating manual alerts
- Clickable links to related incidents

### Reports
- Template selection with format options
- Date range and area filtering
- Asynchronous export with status polling
- Download history with file details

## State Management

### Zustand Stores

**auth-store**:
- Persisted to localStorage
- Tracks user info, access token, and auth status
- Methods: setAuth(), clearAuth()

**ui-store**:
- Sidebar open/closed state
- Theme selection (dark only)

### TanStack Query

- Configured with 30-second stale time
- Retry strategy skips 401/403/404 errors
- Automatic cache management with gcTime

## Error Handling

- API errors are mapped to typed AppError objects
- Mutations display error messages in forms
- 401 errors automatically redirect to login
- Network errors show user-friendly messages

## Security Features

- Strict TypeScript configuration (no `any` types)
- Protected routes requiring authentication
- Authorization tokens in Authorization header
- CSRF protection via axios default headers
- Input sanitization in forms

## Browser Support

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

Proprietary - SSO Industrial Safety Management System
