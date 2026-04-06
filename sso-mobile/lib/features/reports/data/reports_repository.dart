import 'dart:io';

import 'package:dio/dio.dart';

import '../../../core/constants/api_constants.dart';
import '../../../core/exceptions/app_exception.dart';
import '../../../core/models/report.dart';
import '../../../core/network/api_client.dart';

class PaginatedReports {
  final List<Report> reports;
  final int total;
  final int page;
  final int pageSize;

  PaginatedReports({
    required this.reports,
    required this.total,
    required this.page,
    required this.pageSize,
  });

  factory PaginatedReports.fromJson(Map<String, dynamic> json) {
    return PaginatedReports(
      reports: (json['data'] as List<dynamic>)
          .map((r) => Report.fromJson(r as Map<String, dynamic>))
          .toList(),
      total: json['total'] as int? ?? 0,
      page: json['page'] as int? ?? 1,
      pageSize: json['page_size'] as int? ?? 10,
    );
  }
}

class ReportsRepository {
  final ApiClient _apiClient = ApiClient();

  Future<PaginatedReports> getReports({
    String? status,
    int page = 1,
  }) async {
    try {
      final queryParams = {
        'page': page,
        if (status != null) 'status': status,
      };

      return await _apiClient.get(
        ApiConstants.reports,
        queryParameters: queryParams,
        deserializer: (data) =>
            PaginatedReports.fromJson(data as Map<String, dynamic>),
      );
    } on DioException {
      rethrow;
    }
  }

  Future<Report> getReportById(String id) async {
    try {
      return await _apiClient.get(
        ApiConstants.reportById(id),
        deserializer: (data) => Report.fromJson(data as Map<String, dynamic>),
      );
    } on DioException {
      rethrow;
    }
  }

  Future<Report> createReport({
    required String areaId,
    required String type,
    required bool isIap,
    required String description,
    required String shift,
    required File photo,
    double? latitude,
    double? longitude,
  }) async {
    try {
      final fields = {
        'area_id': areaId,
        'type': type,
        'is_iap': isIap,
        'description': description,
        'shift': shift,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
      };

      await _apiClient.uploadMultipart(
        ApiConstants.reports,
        fields: fields,
        fileFieldName: 'photo',
        filePath: photo.path,
      );

      // Return a placeholder report - in real scenario, API would return it
      return Report(
        id: 'new',
        status: 'submitted',
        areaId: areaId,
        areaName: 'Unknown',
        type: type,
        isIap: isIap,
        shift: shift,
        description: description,
        slaStatus: 'on_time',
        createdAt: DateTime.now(),
      );
    } on DioException {
      rethrow;
    }
  }
}
