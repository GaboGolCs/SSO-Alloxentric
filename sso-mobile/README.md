# SSO Field App - Industrial Safety Management System

A comprehensive Flutter mobile application for frontline industrial workers to report and track safety hazards in real-time.

## Features

### Core Functionality
- **Safety Hazard Reporting**: Workers can report unsafe acts and unsafe conditions with photos, location, and detailed descriptions
- **Real-time Status Tracking**: Track report status through the lifecycle (submitted → under review → action assigned → closed)
- **SLA Monitoring**: Visual indicators for on-time, at-risk, and overdue reports
- **Personal Safety Statistics**: View effectiveness rates, participation streaks, and IAP reporting metrics
- **Notifications**: Receive real-time alerts for report status changes and area-specific safety alerts
- **Offline Support**: Reports are queued locally and automatically synced when connectivity is restored

### Advanced Features
- **IAP Integration**: Special handling for IAP (Improvement Opportunity) reports
- **Corrective Actions**: Track assigned corrective actions with due dates and status
- **Comments & Discussion**: Collaborate with team members through report comments
- **Tiered Reporting**: Classification as unsafe acts vs. unsafe conditions
- **Multi-Shift Support**: Report incidents for morning, afternoon, or night shifts
- **Dark Industrial Theme**: Purpose-built dark theme with safety orange accents for visibility

## Project Structure

```
lib/
├── main.dart                 # App initialization & Hive setup
├── app.dart                  # GoRouter configuration & main app wrapper
├── core/
│   ├── constants/
│   │   ├── app_colors.dart       # Color palette (dark theme + safety orange)
│   │   └── api_constants.dart    # API endpoints
│   ├── exceptions/
│   │   └── app_exception.dart    # Sealed exception hierarchy
│   ├── models/
│   │   ├── user.dart             # User model with auth info
│   │   ├── report.dart           # Report + ReportEvent + CorrectiveAction + Comment
│   │   ├── notification_model.dart
│   │   ├── worker_stats.dart     # Performance metrics
│   │   ├── zone.dart             # Work area
│   │   └── offline_report.dart   # Hive-persisted offline queue
│   ├── network/
│   │   ├── api_client.dart       # Dio singleton with interceptors
│   │   └── interceptors/
│   │       ├── auth_interceptor.dart    # Token injection & refresh
│   │       └── error_interceptor.dart   # Exception mapping
│   ├── providers/
│   │   ├── auth_provider.dart         # StateNotifier for auth state
│   │   ├── connectivity_provider.dart # StreamProvider for internet status
│   │   └── offline_queue_provider.dart # StateNotifier for offline sync
│   └── theme/
│       └── app_theme.dart       # Dark theme + InputDecoration styling
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   └── auth_repository.dart
│   │   └── presentation/
│   │       └── login_screen.dart (email + password validation)
│   ├── home/
│   │   ├── presentation/
│   │   │   ├── home_screen.dart (tabbed home with stats + recent reports)
│   │   │   └── home_provider.dart (worker stats provider)
│   ├── reports/
│   │   ├── data/
│   │   │   └── reports_repository.dart (CRUD operations)
│   │   ├── domain/
│   │   │   └── reports_provider.dart (all report-related providers)
│   │   └── presentation/
│   │       ├── reports_list_screen.dart (filterable list)
│   │       ├── report_detail_screen.dart (full details + timeline)
│   │       └── new_report/
│   │           └── new_report_screen.dart (5-step form)
│   └── notifications/
│       ├── data/
│       │   └── notifications_repository.dart
│       ├── domain/
│       │   └── notifications_provider.dart
│       └── presentation/
│           └── notifications_screen.dart
└── shared/
    ├── widgets/
    │   ├── status_badge.dart      # Status pill (submitted/review/assigned/closed)
    │   ├── sla_indicator.dart     # SLA dot + label (on_time/at_risk/overdue)
    │   ├── report_card.dart       # Reusable report list item
    │   ├── error_widget.dart      # Error state UI
    │   ├── loading_widget.dart    # Centered spinner
    │   ├── empty_state_widget.dart # No data state
    │   └── offline_banner.dart    # Connectivity warning
    └── theme/
        └── app_theme.dart
```

## Dependencies

### State Management & Navigation
- `flutter_riverpod: ^2.5.1` - Provider-based state management
- `go_router: ^13.2.0` - Type-safe routing

### Networking & Storage
- `dio: ^5.4.3` - HTTP client with interceptors
- `shared_preferences: ^2.2.3` - Token persistence
- `flutter_secure_storage: ^9.0.0` - Secure token storage
- `hive: ^2.2.3` & `hive_flutter: ^1.1.0` - Offline report queue

### Media & Permissions
- `image_picker: ^1.1.2` - Camera & gallery access
- `cached_network_image: ^3.3.1` - Image caching
- `permission_handler: ^11.3.1` - Runtime permissions
- `connectivity_plus: ^6.0.3` - Network status monitoring

### Utilities
- `intl: ^0.19.0` - Internationalization & date formatting

## API Integration

### Authentication
```
POST /auth/login          → { access_token, refresh_token }
POST /auth/refresh        → { access_token, refresh_token }
POST /auth/logout         → void
GET  /auth/me             → { User }
```

### Reports
```
GET  /reports             → { data: [Report], total, page, page_size }
GET  /reports/{id}        → { Report (with timeline, actions, comments) }
POST /reports             → multipart/form-data with photo
```

### Notifications
```
GET  /workers/me/notifications              → [NotificationModel]
POST /workers/me/notifications/{id}/read    → void
```

### Metadata
```
GET  /workers/me/stats    → { WorkerStats }
GET  /zones               → [Zone]
```

## State Management Architecture

### Auth State (`authProvider`)
- User data, tokens, loading/error states
- Handles login, logout, token refresh
- Redirects to login on 401 errors

### Offline Queue (`offlineQueueProvider`)
- Hive-backed queue of reports captured offline
- Auto-syncs when connectivity returns
- Tracks retry count for failed uploads

### Reports (`reportsListProvider`, `reportDetailProvider`)
- Paginated list with filtering
- Family providers for individual report details
- Auto-refresh on user action

### Notifications (`notificationsProvider`)
- Real-time notification list
- Mark as read functionality
- Unread count aggregator

## Offline-First Design

1. **Detection**: `connectivityProvider` monitors network status
2. **Queuing**: Reports created offline are persisted to Hive
3. **Auto-Sync**: When connectivity returns, `offlineQueueProvider` automatically attempts to upload
4. **User Feedback**: Offline banner displayed at top of screen; UI shows pending sync count
5. **Retry Logic**: Failed uploads retry up to configurable limit

## Theme

### Colors
- **Primary**: `#E85A2A` (Safety Orange) - High visibility for critical actions
- **Background**: `#0D1117` (Dark) - Easy on eyes in industrial environments
- **Risk Levels**:
  - `#2ED573` Green (Low/On-time)
  - `#FFA502` Amber (Medium/At-risk)
  - `#FF4757` Red (High/Overdue)

### Typography
- Material 3 text scale with dark theme
- Bold headings for important information
- Monospace for timestamps and status codes

## Getting Started

### Prerequisites
- Flutter 3.2.0 or higher
- Dart 3.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd sso-mobile
```

2. Install dependencies:
```bash
flutter pub get
```

3. Generate Hive adapters:
```bash
dart run build_runner build
```

4. Run the app:
```bash
flutter run
```

### Configuration

Update `lib/core/constants/api_constants.dart`:
```dart
static const String baseUrl = 'http://your-api-server:8000/v1';
```

## Security Considerations

### Token Management
- Access tokens stored in `FlutterSecureStorage`
- Refresh tokens stored securely and used for token rotation
- Automatic token refresh on 401 responses
- Tokens cleared on logout

### Sensitive Data
- No sensitive data cached in SharedPreferences
- Photos uploaded with multipart/form-data
- API keys never hardcoded in source
- Secure storage for authentication tokens

## Error Handling

All network errors are mapped to domain-specific exceptions:
- `NetworkException`: Timeouts, connectivity issues
- `UnauthorizedException`: 401/403 - Token refresh or logout triggered
- `NotFoundException`: 404
- `ServerException`: 5xx errors
- `OfflineException`: No internet connectivity
- `ValidationException`: 422 with field-level errors
- `CacheException`: Local storage failures

Error states are displayed with retry buttons where appropriate.

## Testing

### Unit Tests
Run with:
```bash
flutter test
```

### Widget Tests
Pre-configured in `test/` directory (create as needed)

### Integration Tests
Use `integration_test/` for E2E testing

## Performance Optimizations

- **Image Caching**: `CachedNetworkImage` for efficient downloads
- **Lazy Loading**: Reports list uses pagination
- **Provider Caching**: Riverpod handles automatic caching
- **Offline Queue**: Batching uploads when sync completes
- **Theme Caching**: Dark theme colors pre-computed

## Known Limitations

- Geolocation captured at report time (not continuous)
- Voice notes not yet implemented (hint in UI)
- Comments are read-only in app (edit via web portal)
- Corrective actions assigned/edited via web only

## Future Enhancements

1. **Biometric Auth**: Fingerprint/Face ID support
2. **Push Notifications**: Real-time alerts for status changes
3. **Voice Notes**: Attach audio to reports
4. **Location Tracking**: GPS breadcrumbs during shifts
5. **Offline Maps**: Download area maps for offline reference
6. **Report Analytics**: Dashboard with charts & trends
7. **Team Collaboration**: Real-time report co-authoring

## License

Proprietary - Alloxentric Inc.

## Support

For issues or feature requests, contact the development team.

---

**Build Date**: March 2026
**Version**: 1.0.0
**Package**: com.alloxentric.sso
