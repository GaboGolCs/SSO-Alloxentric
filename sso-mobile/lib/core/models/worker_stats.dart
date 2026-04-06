import 'package:flutter/foundation.dart';

@immutable
class WorkerStats {
  final String period;
  final int totalReports;
  final int reportsThisPeriod;
  final int closedReports;
  final double effectivenessRate;
  final int iapReports;
  final int participationStreakDays;
  final int rankInArea;

  const WorkerStats({
    required this.period,
    required this.totalReports,
    required this.reportsThisPeriod,
    required this.closedReports,
    required this.effectivenessRate,
    required this.iapReports,
    required this.participationStreakDays,
    required this.rankInArea,
  });

  factory WorkerStats.fromJson(Map<String, dynamic> json) {
    return WorkerStats(
      period: json['period'] as String? ?? 'month',
      totalReports: json['total_reports'] as int? ?? 0,
      reportsThisPeriod: json['reports_this_period'] as int? ?? 0,
      closedReports: json['closed_reports'] as int? ?? 0,
      effectivenessRate: (json['effectiveness_rate'] as num?)?.toDouble() ?? 0.0,
      iapReports: json['iap_reports'] as int? ?? 0,
      participationStreakDays: json['participation_streak_days'] as int? ?? 0,
      rankInArea: json['rank_in_area'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'period': period,
      'total_reports': totalReports,
      'reports_this_period': reportsThisPeriod,
      'closed_reports': closedReports,
      'effectiveness_rate': effectivenessRate,
      'iap_reports': iapReports,
      'participation_streak_days': participationStreakDays,
      'rank_in_area': rankInArea,
    };
  }

  WorkerStats copyWith({
    String? period,
    int? totalReports,
    int? reportsThisPeriod,
    int? closedReports,
    double? effectivenessRate,
    int? iapReports,
    int? participationStreakDays,
    int? rankInArea,
  }) {
    return WorkerStats(
      period: period ?? this.period,
      totalReports: totalReports ?? this.totalReports,
      reportsThisPeriod: reportsThisPeriod ?? this.reportsThisPeriod,
      closedReports: closedReports ?? this.closedReports,
      effectivenessRate: effectivenessRate ?? this.effectivenessRate,
      iapReports: iapReports ?? this.iapReports,
      participationStreakDays: participationStreakDays ?? this.participationStreakDays,
      rankInArea: rankInArea ?? this.rankInArea,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WorkerStats &&
          runtimeType == other.runtimeType &&
          period == other.period &&
          totalReports == other.totalReports &&
          reportsThisPeriod == other.reportsThisPeriod &&
          closedReports == other.closedReports &&
          effectivenessRate == other.effectivenessRate &&
          iapReports == other.iapReports &&
          participationStreakDays == other.participationStreakDays &&
          rankInArea == other.rankInArea;

  @override
  int get hashCode =>
      period.hashCode ^
      totalReports.hashCode ^
      reportsThisPeriod.hashCode ^
      closedReports.hashCode ^
      effectivenessRate.hashCode ^
      iapReports.hashCode ^
      participationStreakDays.hashCode ^
      rankInArea.hashCode;
}
