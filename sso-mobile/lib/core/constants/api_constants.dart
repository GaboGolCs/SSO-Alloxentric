class ApiConstants {
  // Base configuration
  static const String baseUrl = 'http://localhost:8000/v1';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Auth endpoints
  static const String authLogin = '/auth/login';
  static const String authRefresh = '/auth/refresh';
  static const String authLogout = '/auth/logout';
  static const String authMe = '/auth/me';

  // Reports endpoints
  static const String reports = '/reports';
  static String reportById(String id) => '/reports/$id';

  // Workers endpoints
  static const String workerStats = '/workers/me/stats';
  static const String workerNotifications = '/workers/me/notifications';
  static String workerNotificationRead(String id) =>
      '/workers/me/notifications/$id/read';

  // Areas/Zones endpoints
  static const String zones = '/zones';
}
