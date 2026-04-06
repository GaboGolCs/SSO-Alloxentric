# SSO Web Application - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  (Vite Dev Server: localhost:5173)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Router v6                                      │  │
│  │  ├── /login (Public)                                 │  │
│  │  ├── /dashboard (Protected)  → DashboardPage        │  │
│  │  ├── /incidents (Protected)  → IncidentsPage        │  │
│  │  ├── /incidents/:id (Protected) → IncidentDetailPage│  │
│  │  ├── /alerts (Protected)     → AlertsPage           │  │
│  │  └── /reports (Protected)    → ReportsPage          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TanStack Query v5 (Server State)                    │  │
│  │  ├── useHeatmap(), useKPIs(), useTrends()           │  │
│  │  ├── useIncidents(), useIncident()                  │  │
│  │  ├── useAlerts(), useAlertStats()                   │  │
│  │  └── useExportTemplates(), useExportJob()           │  │
│  │                                                       │  │
│  │  Features:                                           │  │
│  │  ├── Automatic caching (staleTime: 30s)             │  │
│  │  ├── Background refetching                          │  │
│  │  ├── Automatic retry (2 attempts)                   │  │
│  │  └── Mutation invalidation                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Zustand (Client State)                              │  │
│  │  ├── auth-store                                      │  │
│  │  │   ├── user: User | null                           │  │
│  │  │   ├── accessToken: string | null                 │  │
│  │  │   └── Persisted to localStorage                  │  │
│  │  └── ui-store                                        │  │
│  │      ├── sidebarOpen: boolean                        │  │
│  │      └── theme: 'dark'                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Axios HTTP Client (lib/api-client.ts)              │  │
│  │  ├── Base URL: http://localhost:8000/v1             │  │
│  │  ├── Request Interceptor                            │  │
│  │  │   └── Add Authorization: Bearer {token}          │  │
│  │  └── Response Interceptor                           │  │
│  │      ├── Handle 401 → Clear auth, redirect login   │  │
│  │      └── Map errors to AppError type               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tailwind CSS + shadcn/ui                            │  │
│  │  ├── Dark theme (#0D1117)                            │  │
│  │  ├── Safety orange primary (#E85A2A)                │  │
│  │  ├── Responsive grid system                         │  │
│  │  └── 47 custom color variables                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/Axios
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           Backend API Server                                │
│  (http://localhost:8000/v1)                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ├── POST /auth/login                                      │
│  ├── GET /dashboard/heatmap                                │
│  ├── GET /dashboard/kpis                                   │
│  ├── GET /dashboard/trends                                 │
│  ├── GET /incidents                                        │
│  ├── GET /incidents/:id                                    │
│  ├── PATCH /incidents/:id                                  │
│  ├── POST /incidents/:id/actions                           │
│  ├── POST /incidents/:id/comments                          │
│  ├── GET /alerts                                           │
│  ├── GET /alerts/stats                                     │
│  ├── PATCH /alerts/:id                                     │
│  ├── POST /alerts/manual                                   │
│  ├── GET /reports/templates                                │
│  ├── POST /reports/export                                  │
│  ├── GET /reports/export/:id                               │
│  └── GET /reports/export-history                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### Authentication Flow
```
User Input (Email/Password)
    ↓
LoginPage Component
    ↓
useMutation (loginMutation)
    ↓
apiPost('/auth/login')
    ↓
Backend validates credentials
    ↓
Response: { user: User, access_token: string }
    ↓
useAuthStore.setAuth(user, token)
    ↓
localStorage persisted
    ↓
Redirect to /dashboard
```

### Query (Read) Flow
```
Component Mount
    ↓
useQuery Hook (e.g., useIncidents)
    ↓
Check TanStack Query Cache
    ↓
If fresh (staleTime not exceeded): Return cached data
    ↓
If stale: Fetch from API
    ↓
apiGet() with Authorization header from auth store
    ↓
Backend process request
    ↓
Response data cached with staleTime: 30s
    ↓
Component receives data, renders with usability
```

### Mutation (Write) Flow
```
User Action (Submit Form)
    ↓
useMutation Hook (e.g., useUpdateIncident)
    ↓
mutateAsync(data)
    ↓
apiPatch() with Authorization header
    ↓
Backend process update
    ↓
Response received (success or error)
    ↓
On Success: Invalidate related queries
    ↓
TanStack Query refetches invalidated data
    ↓
Component re-renders with fresh data
```

## Component Hierarchy

```
App (main router)
├── PublicRoute
│   └── LoginPage
│       ├── Form (email, password)
│       └── Spinner (loading)
│
└── ProtectedRoute
    └── Layout (sidebar + topbar + main)
        ├── Sidebar
        │   ├── Logo
        │   ├── NavLinks (4 items)
        │   ├── UserInfo
        │   └── LogoutButton
        │
        ├── TopBar
        │   ├── PageTitle
        │   ├── NotificationBell
        │   └── UserAvatar
        │
        └── main (route-specific page)
            ├── DashboardPage
            │   ├── PeriodSelector (tabs)
            │   ├── KPICards (4 cards)
            │   ├── Grid
            │   │   ├── HeatMap (SVG)
            │   │   └── TopAreas (list)
            │   └── TrendChart (Recharts)
            │
            ├── IncidentsPage
            │   ├── FilterBar (chips + search)
            │   ├── StatCards (3 metrics)
            │   ├── Card
            │   │   └── Table (incidents)
            │   └── Pagination
            │
            ├── IncidentDetailPage
            │   ├── BackButton
            │   ├── HeroPhoto
            │   └── Grid
            │       ├── Column 1
            │       │   ├── InfoCard
            │       │   ├── SLACard
            │       │   ├── ActionsCard
            │       │   │   └── ActionForm
            │       │   └── CommentsCard
            │       │       └── CommentForm
            │       └── Column 2
            │           ├── StatusForm
            │           └── TimelineCard
            │
            ├── AlertsPage
            │   ├── StatCards (4 metrics)
            │   ├── FilterTabs (5 types)
            │   ├── Card
            │   │   └── AlertCard (list)
            │   └── ManualAlertModal
            │       └── AlertForm
            │
            └── ReportsPage
                └── Grid
                    ├── Column 1
                    │   └── TemplateCard (list)
                    ├── Column 2
                    │   └── ExportForm
                    │       ├── FormatSelect
                    │       ├── DateRange
                    │       ├── AreaFilter
                    │       └── ExportButton
                    │           └── StatusIndicator
                    └── HistoryTable
                        ├── FileName
                        ├── Format
                        ├── Size
                        ├── Date
                        └── DownloadButton
```

## State Management Strategy

### Zustand Stores (Client State)
- **auth-store**: User identity, token, authentication status
  - Persisted to localStorage
  - Updated on login/logout
  - Used globally via `useAuthStore()`

- **ui-store**: Sidebar visibility, theme preference
  - In-memory (not persisted)
  - Updated by user interaction
  - Used by Layout components

### TanStack Query (Server State)
- Automatically fetches, caches, and synchronizes server data
- Queries grouped by logical feature (dashboard, incidents, alerts, reports)
- Automatic refetch on:
  - Window focus
  - Network reconnection
  - Mutation invalidation

### Data Flow Priority
1. Zustand (immediate, used for auth)
2. TanStack Query cache (if fresh)
3. Backend API (if stale)

## API Integration Points

### Request Lifecycle
```
1. Component calls useQuery/useMutation hook
2. TanStack Query builds request
3. Axios interceptor adds auth header
4. POST /url with Authorization: Bearer {token}
5. Backend processes request
6. Response received
7. TanStack Query caches result
8. Component receives data
9. UI re-renders
```

### Error Handling
```
API Error
    ↓
Response Interceptor catches
    ↓
Status 401/403/404? → Special handling
    ↓
Map to AppError { message, statusCode, details }
    ↓
Mutation: Show error in form
Query: Return error state
    ↓
Component displays error message
```

## Code Organization Patterns

### Feature Module Structure
```
features/incidents/
├── api.ts                      # All React hooks for this feature
│   ├── export function useIncidents()
│   ├── export function useIncident()
│   ├── export function useUpdateIncident()
│   ├── export function useCreateAction()
│   └── export interface IncidentFilters
│
├── IncidentsPage.tsx          # Feature main page
│   ├── Uses api hooks
│   ├── Manages local state (filters, page)
│   ├── Renders layout/children
│   └── Passes data to sub-components
│
├── IncidentDetailPage.tsx     # Detail page
│   └── Detailed view with actions
│
└── components/                 # Sub-components
    ├── StatusBadge.tsx
    ├── SLABadge.tsx
    ├── IncidentStatusForm.tsx
    └── ActionForm.tsx
```

### Utility Organization
```
lib/
├── api-client.ts              # HTTP client configuration
│   ├── Axios instance setup
│   ├── Request interceptor
│   ├── Response interceptor
│   └── Helper functions: apiGet, apiPost, apiPatch, apiDelete
│
├── query-client.ts            # TanStack Query setup
│   └── Query configuration with defaults
│
└── utils.ts                   # Helper functions
    ├── cn(): Class name composition
    ├── formatDate(), formatDateTime(), formatRelativeTime()
    ├── getRiskColor(), getStatusBadgeColor(), getSlaColor()
    ├── getStatusLabel(), getShiftLabel(), getIncidentTypeLabel()
    └── getAlertTypeLabel(), getAlertTypeColor()
```

## TypeScript Type System

### Type Hierarchy
```
User
├── id: string
├── name: string
├── email: string
├── role: 'worker' | 'area_chief' | 'analyst' | 'sso_manager'
└── assignedAreas?: string[]

Incident
├── id: string
├── status: 'submitted' | 'under_review' | 'action_assigned' | 'closed' | 'overdue'
├── zoneName: string
├── shift: 'morning' | 'afternoon' | 'night'
├── type: 'unsafe_act' | 'unsafe_condition'
├── isIap: boolean
├── photoUrl: string
├── responsible?: User
├── slaDeadline?: string
└── slaStatus: 'on_time' | 'at_risk' | 'overdue'

IncidentDetail extends Incident
├── areaId: string
├── description: string
├── reportedBy: User
├── actions: CorrectiveAction[]
├── comments: Comment[]
└── timeline: TimelineEvent[]

Zone
├── zoneId: string
├── name: string
├── riskScore: number (0-100)
├── riskLevel: 'high' | 'medium' | 'low'
├── openReports: number
├── overdueActions: number
├── trend: 'rising' | 'stable' | 'falling'
└── polygon?: [number, number][]

Alert
├── id: string
├── type: 'iap' | 'sla' | 'zone' | 'auto' | 'manual'
├── title: string
├── body: string
├── zoneId?: string
├── incidentId?: string
└── status: 'active' | 'resolved'

ExportJob
├── exportId: string
├── status: 'processing' | 'ready' | 'failed'
├── format: string
├── filename?: string
├── fileSizeKb?: number
├── downloadUrl?: string
└── createdAt: string

PaginatedResponse<T>
├── data: T[]
└── pagination: { page, pageSize, total, totalPages }
```

## Performance Optimizations

### Query Optimization
```
staleTime: 30s
├── Data considered fresh for 30 seconds
├── No refetch during this period
└── Improves performance, reduces API calls

gcTime: 5m
├── Inactive cache kept for 5 minutes
└── Instant response if user revisits

retry: 2
├── Failed requests retried max 2 times
├── Except 401/403/404 errors
└── Improves reliability
```

### Component Optimization
```
React.memo on:
├── AlertCard (memoized due to re-renders)
└── StatusBadge, SLABadge (pure components)

Recharts:
├── ResponsiveContainer (responsive sizing)
└── LineChart (efficient rendering)

Virtualization:
└── Consider for large incident lists (future enhancement)
```

### Bundle Optimization
```
Vite:
├── Code splitting at route boundaries
├── Lazy loading with React.lazy
├── Tree-shaking of unused code
└── CSS purging with Tailwind

Production:
├── Minification
├── Compression
└── Source maps disabled
```

## Deployment Architecture

```
Development                    Production
├── npm run dev                npm run build
├── Vite dev server            Static files (dist/)
├── Hot reload                 CDN or web server
└── Source maps                Minified + compressed
```

## Security Considerations

### Authentication
```
JWT stored in localStorage
├── Added to all requests via interceptor
└── Cleared on 401 response

Authorization
├── Protected routes check isAuthenticated
└── Redirect to login if not authenticated
```

### Input Validation
```
Form inputs:
├── Type checking via TypeScript
├── Runtime validation in handlers
└── Error messages to users

API responses:
├── Type checking via interfaces
└── Error handling for invalid data
```

### XSS Prevention
```
React automatic:
├── JSX escapes text content
├── Prevents injection attacks
└── Safe rendering of user data

Dangerous patterns avoided:
├── dangerouslySetInnerHTML
└── eval() or similar
```

## Testing Strategy

### Unit Tests (Recommended)
```
lib/utils.ts
├── formatDate() → Tests localization
├── getRiskColor() → Tests mapping logic
└── getStatusLabel() → Tests Spanish labels

Components
├── Badge.tsx → Tests variants
├── Card.tsx → Tests title/action slots
└── Spinner.tsx → Tests sizes
```

### Integration Tests (Recommended)
```
Features
├── Dashboard → Load data, verify display
├── Incidents → Filter, search, paginate
├── Alerts → Filter, resolve, create
└── Reports → Select template, export, poll
```

### E2E Tests (Recommended)
```
Critical Paths
├── Login → Dashboard → View heat map
├── Create incident → Update status → Add action
├── Generate report → Download file
└── Create alert → Resolve alert
```

## Monitoring & Debugging

### Browser DevTools
```
Network Tab:
├── API request URLs
├── Request/response headers
├── Status codes
├── Response payloads
└── Performance timing

Console:
├── TypeScript errors
├── Runtime errors
├── Network errors
└── Component logs

React DevTools:
├── Component tree
├── Props inspection
├── State inspection
└── Performance profiling
```

### Application Logging
```
Error logging:
├── catch blocks log errors
└── Console output in development

Performance metrics:
├── Query timing via TanStack Query
└── Component render times
```

## Future Enhancements

### Short-term
1. **WebSocket Integration** - Real-time alerts
2. **Email Notifications** - Alert delivery
3. **Batch Operations** - Multi-select incidents
4. **Advanced Filters** - Date range, custom fields
5. **Export to Excel** - Pivot table support

### Medium-term
1. **Role-based UI** - Different views per role
2. **Audit Logging** - Complete action history
3. **Offline Mode** - Service worker caching
4. **Mobile Optimization** - Touch gestures, responsive layouts
5. **Theme Customization** - Light/dark toggle

### Long-term
1. **Real-time Collaboration** - Multiple users editing
2. **AI Integration** - Risk prediction
3. **Mobile App** - React Native
4. **Data Warehouse** - Analytics backend
5. **Internationalization** - Multi-language support

---

This architecture provides a scalable, maintainable foundation for the SSO industrial safety management system.
