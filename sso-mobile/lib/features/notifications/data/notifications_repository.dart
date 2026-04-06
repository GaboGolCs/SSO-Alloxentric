import 'package:dio/dio.dart';

import '../../../core/constants/api_constants.dart';
import '../../../core/models/notification_model.dart';
import '../../../core/network/api_client.dart';

class NotificationsRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<NotificationModel>> getNotifications({
    bool unreadOnly = false,
  }) async {
    try {
      final queryParams = {
        if (unreadOnly) 'unread_only': true,
      };

      return await _apiClient.get(
        ApiConstants.workerNotifications,
        queryParameters: queryParams,
        deserializer: (data) {
          return (data as List<dynamic>)
              .map((n) =>
                  NotificationModel.fromJson(n as Map<String, dynamic>))
              .toList();
        },
      );
    } on DioException {
      rethrow;
    }
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      await _apiClient.post(
        ApiConstants.workerNotificationRead(notificationId),
        deserializer: (_) => null,
      );
    } on DioException {
      rethrow;
    }
  }

  Future<void> markAllAsRead() async {
    try {
      final notifications = await getNotifications();
      for (final notification in notifications) {
        if (!notification.read) {
          await markAsRead(notification.id);
        }
      }
    } on DioException {
      rethrow;
    }
  }
}
