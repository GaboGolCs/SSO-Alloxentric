import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/notification_model.dart';
import '../data/notifications_repository.dart';

final notificationsRepositoryProvider = Provider(
  (ref) => NotificationsRepository(),
);

final notificationsListProvider = FutureProvider<List<NotificationModel>>((ref) {
  final repository = ref.watch(notificationsRepositoryProvider);
  return repository.getNotifications();
});

class NotificationsNotifier extends StateNotifier<List<NotificationModel>> {
  final NotificationsRepository _repository;

  NotificationsNotifier(this._repository) : super([]) {
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      final notifications = await _repository.getNotifications();
      state = notifications;
    } catch (e) {
      // Handle error silently in state
    }
  }

  Future<void> refresh() async {
    await _loadNotifications();
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      await _repository.markAsRead(notificationId);
      state = [
        for (final n in state)
          if (n.id == notificationId) n.copyWith(read: true) else n,
      ];
    } catch (e) {
      // Handle error
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _repository.markAllAsRead();
      state = [
        for (final n in state) n.copyWith(read: true),
      ];
    } catch (e) {
      // Handle error
    }
  }

  int get unreadCount => state.where((n) => !n.read).length;

  List<NotificationModel> get unreadNotifications =>
      state.where((n) => !n.read).toList();
}

final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, List<NotificationModel>>((ref) {
  final repository = ref.watch(notificationsRepositoryProvider);
  return NotificationsNotifier(repository);
});

final unreadCountProvider = Provider((ref) {
  return ref.watch(notificationsProvider).where((n) => !n.read).length;
});
