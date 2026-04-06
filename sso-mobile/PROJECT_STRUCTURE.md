# SSO Mobile App - Complete Project Structure

## Overview
This is a production-quality Flutter mobile application for industrial safety management. The app enables frontline workers to report hazards, track status, receive notifications, and view performance metrics.

## Directory Structure

```
sso-mobile/
├── android/
│   ├── app/
│   │   ├── build.gradle              # Android build configuration
│   │   └── src/main/
│   │       └── AndroidManifest.xml   # App permissions & manifest
│   ├── build.gradle
│   └── settings.gradle
├── ios/
│   ├── Runner/
│   │   └── Info.plist               # iOS permissions & config
│   ├── Runner.xcodeproj/
│   └── Podfile
├── lib/
│   ├── main.dart                    # App entry point (Hive + ProviderScope init)
│   ├── app.dart                     # GoRouter setup & main SsoApp widget
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_colors.dart      # Color palette (dark theme + safety orange)
│   │   │   └── api_constants.dart   # API endpoints & timeouts
│   │   ├── exceptions/
│   │   │   └── app_exception.dart   # Sealed exception hierarchy
│   │   ├── models/
│   │   │   ├── user.dart            # User authentication model
│   │   │   ├── report.dart          # Report + ReportEvent + CorrectiveAction + Comment
│   │   │   ├── notification_model.dart
│   │   │   ├── worker_stats.dart    # Performance metrics
│   │   │   ├── zone.dart            # Work areas/zones
│   │   │   ├── offline_report.dart  # Hive model for offline queue
│   │   │   └── offline_report.g.dart # Generated Hive adapter
│   │   ├── network/
│   │   │   ├── api_client.dart      # Dio singleton with timeout config
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart    # Bearer token injection & refresh
│   │   │       └── error_interceptor.dart   # Exception mapping (401, 422, 5xx)
│   │   ├── providers/
│   │   │   ├── auth_provider.dart         # StateNotifier<AuthState>
│   │   │   ├── connectivity_provider.dart # StreamProvider<bool>
│   │   │   └── offline_queue_provider.dart # StateNotifier<List<OfflineReport>>
│   │   └── theme/
│   │       └── app_theme.dart      # ThemeData with dark mode + InputDecoration
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   └── auth_repository.dart   # API calls: login, logout, getMe
│   │   │   └── presentation/
│   │   │       └── login_screen.dart      # Email + password form with validation
│   │   ├── home/
│   │   │   └── presentation/
│   │   │       ├── home_screen.dart       # Bottom-tabbed home (3 tabs)
│   │   │       │                         # Tab 1: Greeting + stats cards + FAB
│   │   │       │                         # Tab 2: Recent reports list
│   │   │       │                         # Tab 3: Profile with logout
│   │   │       └── home_provider.dart     # FutureProvider<WorkerStats>
│   │   ├── reports/
│   │   │   ├── data/
│   │   │   │   └── reports_repository.dart # getReports, getReportById, createReport
│   │   │   ├── domain/
│   │   │   │   └── reports_provider.dart   # All report-related providers
│   │   │   │                              # - reportsListProvider
│   │   │   │                              # - reportDetailProvider.family
│   │   │   │                              # - createReportProvider.family
│   │   │   │                              # - zonesProvider
│   │   │   │                              # - recentReportsProvider
│   │   │   └── presentation/
│   │   │       ├── reports_list_screen.dart # Filterable list with chips
│   │   │       │                           # (Todos, Pendientes, IAP, Vencidos)
│   │   │       ├── report_detail_screen.dart # Hero photo + timeline + actions
│   │   │       └── new_report/
│   │   │           └── new_report_screen.dart # 5-step Stepper form
│   │   │                                      # 1. Photo capture
│   │   │                                      # 2. Location (placeholder)
│   │   │                                      # 3. Area & shift dropdown
│   │   │                                      # 4. Classification (unsafe act/condition + IAP)
│   │   │                                      # 5. Description & review
│   │   └── notifications/
│   │       ├── data/
│   │       │   └── notifications_repository.dart
│   │       ├── domain/
│   │       │   └── notifications_provider.dart # StateNotifier for notifications
│   │       └── presentation/
│   │           └── notifications_screen.dart # ListView with read/unread states
│   └── shared/
│       ├── widgets/
│       │   ├── status_badge.dart        # Status pill (submitted/review/assigned/closed)
│       │   ├── sla_indicator.dart       # SLA indicator (on_time/at_risk/overdue)
│       │   ├── report_card.dart         # Thumbnail + metadata reusable card
│       │   ├── error_widget.dart        # Full-screen error with retry
│       │   ├── loading_widget.dart      # Centered spinner
│       │   ├── empty_state_widget.dart  # No data state with optional action
│       │   └── offline_banner.dart      # Offline connectivity warning
│       └── theme/
│           └── app_theme.dart          # Exported app theme
├── test/                            # Unit tests (optional)
├── integration_test/                # E2E tests (optional)
├── pubspec.yaml                     # Dependencies & project config
├── analysis_options.yaml            # Linter rules
├── .gitignore                       # Git ignore patterns
├── README.md                        # User-facing documentation
└── PROJECT_STRUCTURE.md            # This file
```

## Core Components Explained

### Authentication Flow (`core/providers/auth_provider.dart`)
1. User enters email/password on LoginScreen
2. `authProvider.notifier.login()` calls `AuthRepository.login()`
3. API returns `access_token` and `refresh_token`
4. Tokens stored in `FlutterSecureStorage`
5. `user` property populated via `getMe()` call
6. State updates to `isAuthenticated: true`
7. GoRouter redirects from `/login` to `/`

### Token Refresh Flow (`core/network/interceptors/auth_interceptor.dart`)
1. Any API call includes `Authorization: Bearer <token>` header
2. If API returns 401, `AuthInterceptor` intercepts
3. Reads `refresh_token` from secure storage
4. POSTs to `/auth/refresh`
5. On success: new tokens stored, original request retried
6. On failure: tokens cleared, user redirected to `/login`

### Report Creation Flow (`features/reports/presentation/new_report/new_report_screen.dart`)
1. User taps FAB "REPORTAR"
2. Multi-step form (Stepper widget):
   - Step 1: Camera capture → saved to `_photoFile`
   - Step 2: Location selection (placeholder)
   - Step 3: Dropdown for area & shift
   - Step 4: Classification (toggle unsafe_act/unsafe_condition, IAP switch)
   - Step 5: Description textarea (min 10 chars)
   - Step 6: Review summary
3. On submit:
   - Check connectivity via `connectivityProvider`
   - If online: `createReportProvider` calls API with multipart/form-data
   - If offline: Report persisted to Hive via `offlineQueueProvider`
4. Success snackbar shown, navigation back to home

### Offline Queue Flow (`core/providers/offline_queue_provider.dart`)
1. Report created offline → added to Hive box via `enqueueReport()`
2. Status: `queued` (→ `syncing` → `failed` or removed)
3. `connectivityProvider` StreamProvider emits connectivity changes
4. When online detected: `syncPending()` auto-triggered
5. For each queued report: upload to API with retry logic
6. Failed reports retain status `failed` with retry count
7. Home screen shows "X reportes pendientes de sincronizar" badge

### Notification Updates Flow
1. User navigates to `/notifications`
2. `notificationsProvider.notifier` loads all notifications
3. Tap notification → if `reportId` present, navigate to report detail
4. Tap notification → mark as read via `markAsRead(id)`
5. "Mark all as read" button calls `markAllAsRead()`
6. Unread count displayed in AppBar badge (red circle)

## Data Models & Serialization

### User
```dart
User {
  id: String
  name: String
  email: String
  role: String ('worker', 'supervisor', 'admin')
  planTier: String ('standard', 'premium')
}
```

### Report (Complex)
```dart
Report {
  id: String
  status: String ('submitted', 'under_review', 'action_assigned', 'closed')
  areaId: String
  areaName: String
  type: String ('unsafe_act', 'unsafe_condition')
  isIap: bool
  shift: String ('morning', 'afternoon', 'night')
  description: String
  photoUrl: String? (from API)
  slaStatus: String ('on_time', 'at_risk', 'overdue')
  createdAt: DateTime
  timeline: List<ReportEvent>  # Status change history
  actions: List<CorrectiveAction>  # Assigned tasks
  comments: List<Comment>  # Collaboration thread
}
```

### OfflineReport (Hive)
```dart
@HiveType(typeId: 0)
OfflineReport {
  localId: String  # UUID generated at creation
  areaId: String
  type: String
  isIap: bool
  description: String
  shift: String
  photoPath: String  # File system path (not URL)
  status: String ('queued', 'syncing', 'failed')
  createdAt: DateTime
  retryCount: int
}
```

## Navigation Routes

```
/login              → LoginScreen (public)
/                   → HomeScreen (requires auth)
/reports            → ReportsListScreen (requires auth)
/reports/new        → NewReportScreen (requires auth)
/reports/:id        → ReportDetailScreen(id) (requires auth)
/notifications      → NotificationsScreen (requires auth)
```

GoRouter redirect logic in `app.dart`:
- No token → force to `/login`
- Token valid → allow navigation
- 401 response → auto-redirect to `/login` via AuthInterceptor

## Theme System

### Color Palette (`core/constants/app_colors.dart`)
- **Primary**: `#E85A2A` (Safety Orange) — CTA buttons, important alerts
- **Dark backgrounds**: `#0D1117` (Very dark blue) — Reduces eye strain
- **Cards**: `#161B22` (Dark gray-blue)
- **Elevated**: `#1C2128` (Slightly lighter for depth)
- **Text Primary**: `#F0F6FC` (Off-white)
- **Text Secondary**: `#8B949E` (Gray)
- **Border**: `#30363D` (Subtle dividers)

### Status Colors
- **Green** (`#2ED573`) — Low risk / On-time SLA
- **Amber** (`#FFA502`) — Medium risk / At-risk SLA
- **Red** (`#FF4757`) — High risk / Overdue SLA

### Material Design 3
- `useMaterial3: true` in theme
- Modern animations, better accessibility
- Dark theme ColorScheme with orange seed color

## API Client Architecture

### Dio Setup (`core/network/api_client.dart`)
- Singleton pattern: single instance across app
- Base URL: `http://localhost:8000/v1`
- Timeouts: 30s connect, 30s receive
- LogInterceptor in debug mode (logs request/response)
- AuthInterceptor adds Bearer token
- ErrorInterceptor maps Dio exceptions to AppException

### Error Handling Pipeline
```
Dio exception → ErrorInterceptor.onError()
  ↓
Status code check (401, 403, 404, 422, 5xx)
  ↓
Map to AppException subclass
  ↓
App catches & displays in UI (snackbar, dialog, error widget)
```

## Provider Architecture (Riverpod)

### Provider Types Used
- **Provider**: Simple read-only (colors, constants)
- **FutureProvider**: Async data fetch (reports, stats, notifications)
- **StreamProvider**: Stream subscription (connectivity)
- **StateNotifierProvider**: Mutable state (auth, offline queue, reports list)
- **.family**: Parameterized providers (reportDetailProvider(id))
- **.autoDispose**: Auto-cleanup when unused (createReportProvider)

### Example Provider Chain
```dart
// FutureProvider dependency
final zonesProvider = FutureProvider((ref) async {
  return apiClient.get(ApiConstants.zones, ...);
});

// StateNotifier using FutureProvider
final reportsListProvider = StateNotifierProvider((ref) {
  return ReportsListNotifier(repository);
});

// Watching multiple providers
final homeScreenAsync = ref.watch(reportsListProvider);
final connectivity = ref.watch(connectivityProvider);
```

## Offline-First Implementation

### Hive Setup (`main.dart`)
```dart
await Hive.initFlutter();
Hive.registerAdapter(OfflineReportAdapter());
await Hive.openBox<OfflineReport>('offline_reports');
```

### Queue Management (`offline_queue_provider.dart`)
1. **enqueueReport()** — Add to Hive box
2. **syncPending()** — Iterate queue, upload each
3. **_syncReport()** — Single report upload with retry
4. **removeReport()** — Delete from queue on success

### Auto-Sync Trigger
```dart
_ref.listen(connectivityProvider, (previous, next) {
  next.whenData((isConnected) {
    if (isConnected && !_isSyncing) {
      syncPending();  // Auto-trigger upload
    }
  });
});
```

## Performance Optimizations

### Caching
- `CachedNetworkImage` for report photos (memory + disk cache)
- Riverpod's built-in provider caching
- Hive for offline persistence

### Lazy Loading
- Reports list paginated (page 1 default)
- Home screen shows only 3 recent reports
- Details fetched on-demand via `reportDetailProvider.family`

### Widget Optimization
- `IndexedStack` in home_screen for tab navigation (preserves state)
- `const` constructors where possible
- `repaint` boundary optimization for heavy widgets

## Security & Compliance

### Data Protection
- Tokens stored in `FlutterSecureStorage` (encrypted)
- No sensitive data in SharedPreferences
- Photos uploaded with multipart/form-data (no base64)
- API enforces HTTPS in production

### Permissions (`AndroidManifest.xml` / `Info.plist`)
- **Camera** — Photo capture (CAMERA)
- **Location** — For report context (ACCESS_FINE_LOCATION)
- **Internet** — API communication (INTERNET)
- **Files** — Photo storage (READ/WRITE_EXTERNAL_STORAGE on Android)
- **Network** — Connectivity check (ACCESS_NETWORK_STATE)

### Runtime Permissions
- `permission_handler` package
- Requests shown on Android 6+ / iOS 14+
- Camera permission required before photo step

## Testing Strategy

### Unit Tests (create in `test/`)
- Model serialization (fromJson/toJson)
- Exception mapping
- Provider state transitions

### Widget Tests (create in `test/`)
- Form validation
- Navigation
- Error states

### Integration Tests (create in `integration_test/`)
- Full login flow
- Report creation (online & offline)
- Sync behavior

### Manual Testing Checklist
- [ ] Login with valid/invalid credentials
- [ ] Create report online
- [ ] Create report offline, verify queue, sync when online
- [ ] View report details with all nested objects
- [ ] Filter reports by status
- [ ] Mark notifications as read
- [ ] Logout behavior
- [ ] Network toggle (airplane mode)

## Build & Deployment

### Debug Build
```bash
flutter run -v
```

### Release Build (Android APK)
```bash
flutter build apk --release
```

### Release Build (iOS)
```bash
flutter build ios --release
```

### Code Generation
Before building, run:
```bash
dart run build_runner build
```
(Generates Hive adapters, Riverpod code if using riverpod_generator)

## Environment Configuration

Create `.env` file (not in version control):
```
API_BASE_URL=http://localhost:8000/v1
API_TIMEOUT_SECONDS=30
```

Load in `main.dart` if needed. For now, hardcoded in `api_constants.dart`.

## Troubleshooting

### Build Issues
- "Flutter SDK not found" → Check `flutter/bin` in PATH
- Hive adapter not generated → Run `dart run build_runner build`
- Pod install fails (iOS) → Run `flutter clean && flutter pub get`

### Runtime Issues
- 401 errors persisting → Check `FlutterSecureStorage` permissions
- Photos not uploading → Check camera/storage permissions in settings
- Offline queue not syncing → Verify `connectivityProvider` implementation
- UI not updating → Check `ref.watch()` vs `ref.read()` usage

### Network Issues
- "Connection timeout" → API server down or slow network
- "Certificate error" → Use `usesCleartextTraffic="false"` for HTTPS only
- CORS errors → Backend must allow frontend domain

## Documentation

- **README.md** — User-facing setup & feature overview
- **PROJECT_STRUCTURE.md** — This file, technical architecture
- **Code Comments** — Inline documentation for complex logic
- **Git Commits** — Descriptive messages for feature tracking

## Version Control

### Commit Message Convention
```
feat: Add report offline queuing
fix: Handle 401 token refresh
refactor: Extract status badge to reusable widget
docs: Update README with offline instructions
```

### Branch Strategy
- `main` — Production releases
- `develop` — Integration branch
- `feature/xyz` — Feature branches
- `bugfix/xyz` — Bug fixes

## Future Roadmap

- [ ] **Push Notifications** — FCM/APNs integration
- [ ] **Biometric Auth** — Fingerprint/Face ID
- [ ] **Voice Notes** — Audio attachment to reports
- [ ] **Offline Maps** — Downloaded area maps
- [ ] **Analytics Dashboard** — Charts & trends in-app
- [ ] **Team Collaboration** — Real-time co-authoring
- [ ] **Geofencing** — Location-based alerts

---

**Last Updated**: March 2026
**App Version**: 1.0.0
**Flutter Version**: 3.2.0+
