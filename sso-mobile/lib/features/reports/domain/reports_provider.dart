import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/report.dart';
import '../../../core/models/zone.dart';
import '../../../core/network/api_client.dart';
import '../../../core/constants/api_constants.dart';
import '../data/reports_repository.dart';

final reportsRepositoryProvider = Provider((ref) => ReportsRepository());

final reportsListProvider =
    StateNotifierProvider<ReportsListNotifier, AsyncValue<PaginatedReports>>(
  (ref) {
    final repository = ref.watch(reportsRepositoryProvider);
    return ReportsListNotifier(repository);
  },
);

class ReportsListNotifier extends StateNotifier<AsyncValue<PaginatedReports>> {
  final ReportsRepository _repository;
  int _currentPage = 1;
  String? _selectedStatus;

  ReportsListNotifier(this._repository) : super(const AsyncValue.loading()) {
    _loadReports();
  }

  Future<void> _loadReports() async {
    state = const AsyncValue.loading();
    try {
      final reports = await _repository.getReports(
        status: _selectedStatus,
        page: _currentPage,
      );
      state = AsyncValue.data(reports);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> refresh() async {
    _currentPage = 1;
    await _loadReports();
  }

  Future<void> nextPage() async {
    _currentPage++;
    await _loadReports();
  }

  Future<void> filterByStatus(String? status) async {
    _selectedStatus = status;
    _currentPage = 1;
    await _loadReports();
  }
}

final reportDetailProvider =
    FutureProvider.family<Report, String>((ref, reportId) async {
  final repository = ref.watch(reportsRepositoryProvider);
  return repository.getReportById(reportId);
});

final recentReportsProvider = FutureProvider<List<Report>>((ref) async {
  final repository = ref.watch(reportsRepositoryProvider);
  final reports = await repository.getReports(page: 1);
  return reports.reports.take(3).toList();
});

final zonesProvider = FutureProvider<List<Zone>>((ref) async {
  final apiClient = ApiClient();
  return apiClient.get(
    ApiConstants.zones,
    deserializer: (data) {
      return (data as List<dynamic>)
          .map((z) => Zone.fromJson(z as Map<String, dynamic>))
          .toList();
    },
  );
});

final createReportProvider = FutureProvider.autoDispose
    .family<Report, CreateReportParams>((ref, params) async {
  final repository = ref.watch(reportsRepositoryProvider);
  return repository.createReport(
    areaId: params.areaId,
    type: params.type,
    isIap: params.isIap,
    description: params.description,
    shift: params.shift,
    photo: params.photo,
    latitude: params.latitude,
    longitude: params.longitude,
  );
});

class CreateReportParams {
  final String areaId;
  final String type;
  final bool isIap;
  final String description;
  final String shift;
  final dynamic photo;
  final double? latitude;
  final double? longitude;

  CreateReportParams({
    required this.areaId,
    required this.type,
    required this.isIap,
    required this.description,
    required this.shift,
    required this.photo,
    this.latitude,
    this.longitude,
  });
}
