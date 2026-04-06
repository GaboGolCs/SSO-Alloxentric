import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/worker_stats.dart';
import '../../reports/domain/reports_provider.dart';

final workerStatsProvider = FutureProvider<WorkerStats>((ref) async {
  // In a real app, this would fetch from the API
  // For now, return a default instance
  return const WorkerStats(
    period: 'month',
    totalReports: 0,
    reportsThisPeriod: 0,
    closedReports: 0,
    effectivenessRate: 0.0,
    iapReports: 0,
    participationStreakDays: 0,
    rankInArea: 0,
  );
});
