import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../constants/api_constants.dart';
import '../exceptions/app_exception.dart';
import '../models/offline_report.dart';
import '../network/api_client.dart';
import 'connectivity_provider.dart';

class OfflineQueueNotifier extends StateNotifier<List<OfflineReport>> {
  late Box<OfflineReport> _box;
  final Ref _ref;
  bool _isSyncing = false;

  OfflineQueueNotifier(this._ref) : super([]) {
    _initialize();
  }

  Future<void> _initialize() async {
    _box = Hive.box<OfflineReport>('offline_reports');
    state = _box.values.toList();

    // Listen to connectivity changes and sync when online
    _ref.listen(connectivityProvider, (previous, next) {
      next.whenData((isConnected) {
        if (isConnected && !_isSyncing) {
          syncPending();
        }
      });
    });
  }

  Future<void> enqueueReport(OfflineReport report) async {
    try {
      await _box.add(report);
      state = _box.values.toList();
    } catch (e) {
      throw CacheException('Failed to queue report: ${e.toString()}');
    }
  }

  Future<void> syncPending() async {
    if (_isSyncing) return;

    _isSyncing = true;
    final reportsToSync =
        state.where((r) => r.status == 'queued' || r.status == 'failed').toList();

    for (final report in reportsToSync) {
      try {
        await _syncReport(report);
      } catch (e) {
        // Continue with next report even if one fails
      }
    }

    _isSyncing = false;
  }

  Future<void> _syncReport(OfflineReport report) async {
    try {
      // Update status to syncing
      final index = _box.values.toList().indexOf(report);
      if (index != -1) {
        final updatedReport = report.copyWith(status: 'syncing');
        await _box.putAt(index, updatedReport);
        state = _box.values.toList();
      }

      // Check connectivity
      final isConnected = await _ref.read(connectivityProvider.future);
      if (!isConnected) {
        throw OfflineException('No internet connection');
      }

      // Upload to API
      final apiClient = ApiClient();

      final formData = {
        'area_id': report.areaId,
        'type': report.type,
        'is_iap': report.isIap,
        'description': report.description,
        'shift': report.shift,
      };

      await apiClient.uploadMultipart(
        ApiConstants.reports,
        fields: formData,
        fileFieldName: 'photo',
        filePath: report.photoPath,
      );

      // Remove from queue on success
      final indexAfterSync = _box.values.toList().indexOf(report);
      if (indexAfterSync != -1) {
        await _box.deleteAt(indexAfterSync);
      }
      state = _box.values.toList();
    } catch (e) {
      // Update status to failed and increment retry count
      final index = _box.values.toList().indexOf(report);
      if (index != -1) {
        final failedReport = report.copyWith(
          status: 'failed',
          retryCount: report.retryCount + 1,
        );
        await _box.putAt(index, failedReport);
        state = _box.values.toList();
      }
    }
  }

  Future<void> removeReport(String localId) async {
    try {
      final index = _box.values
          .toList()
          .indexWhere((r) => r.localId == localId);
      if (index != -1) {
        await _box.deleteAt(index);
        state = _box.values.toList();
      }
    } catch (e) {
      throw CacheException('Failed to remove queued report');
    }
  }

  int get pendingCount => state.length;

  List<OfflineReport> get failedReports =>
      state.where((r) => r.status == 'failed').toList();
}

final offlineQueueProvider =
    StateNotifierProvider<OfflineQueueNotifier, List<OfflineReport>>((ref) {
  return OfflineQueueNotifier(ref);
});

final pendingOfflineReportsProvider = Provider((ref) {
  return ref.watch(offlineQueueProvider).length;
});
