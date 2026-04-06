import 'package:flutter/foundation.dart';

@immutable
class Report {
  final String id;
  final String status; // submitted, under_review, action_assigned, closed
  final String areaId;
  final String areaName;
  final String type; // unsafe_act, unsafe_condition
  final bool isIap;
  final String shift; // morning, afternoon, night
  final String description;
  final String? photoUrl;
  final String slaStatus; // on_time, at_risk, overdue
  final DateTime createdAt;
  final List<ReportEvent> timeline;
  final List<CorrectiveAction> actions;
  final List<Comment> comments;

  const Report({
    required this.id,
    required this.status,
    required this.areaId,
    required this.areaName,
    required this.type,
    required this.isIap,
    required this.shift,
    required this.description,
    this.photoUrl,
    required this.slaStatus,
    required this.createdAt,
    this.timeline = const [],
    this.actions = const [],
    this.comments = const [],
  });

  factory Report.fromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id'] as String? ?? '',
      status: json['status'] as String? ?? 'submitted',
      areaId: json['area_id'] as String? ?? '',
      areaName: json['area_name'] as String? ?? '',
      type: json['type'] as String? ?? 'unsafe_condition',
      isIap: json['is_iap'] as bool? ?? false,
      shift: json['shift'] as String? ?? 'morning',
      description: json['description'] as String? ?? '',
      photoUrl: json['photo_url'] as String?,
      slaStatus: json['sla_status'] as String? ?? 'on_time',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      timeline: (json['timeline'] as List<dynamic>?)
              ?.map((e) => ReportEvent.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      actions: (json['actions'] as List<dynamic>?)
              ?.map((e) => CorrectiveAction.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      comments: (json['comments'] as List<dynamic>?)
              ?.map((e) => Comment.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'status': status,
      'area_id': areaId,
      'area_name': areaName,
      'type': type,
      'is_iap': isIap,
      'shift': shift,
      'description': description,
      'photo_url': photoUrl,
      'sla_status': slaStatus,
      'created_at': createdAt.toIso8601String(),
      'timeline': timeline.map((e) => e.toJson()).toList(),
      'actions': actions.map((e) => e.toJson()).toList(),
      'comments': comments.map((e) => e.toJson()).toList(),
    };
  }

  Report copyWith({
    String? id,
    String? status,
    String? areaId,
    String? areaName,
    String? type,
    bool? isIap,
    String? shift,
    String? description,
    String? photoUrl,
    String? slaStatus,
    DateTime? createdAt,
    List<ReportEvent>? timeline,
    List<CorrectiveAction>? actions,
    List<Comment>? comments,
  }) {
    return Report(
      id: id ?? this.id,
      status: status ?? this.status,
      areaId: areaId ?? this.areaId,
      areaName: areaName ?? this.areaName,
      type: type ?? this.type,
      isIap: isIap ?? this.isIap,
      shift: shift ?? this.shift,
      description: description ?? this.description,
      photoUrl: photoUrl ?? this.photoUrl,
      slaStatus: slaStatus ?? this.slaStatus,
      createdAt: createdAt ?? this.createdAt,
      timeline: timeline ?? this.timeline,
      actions: actions ?? this.actions,
      comments: comments ?? this.comments,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Report &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          status == other.status &&
          areaId == other.areaId &&
          areaName == other.areaName &&
          type == other.type &&
          isIap == other.isIap &&
          shift == other.shift &&
          description == other.description &&
          photoUrl == other.photoUrl &&
          slaStatus == other.slaStatus &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      status.hashCode ^
      areaId.hashCode ^
      areaName.hashCode ^
      type.hashCode ^
      isIap.hashCode ^
      shift.hashCode ^
      description.hashCode ^
      photoUrl.hashCode ^
      slaStatus.hashCode ^
      createdAt.hashCode;
}

@immutable
class ReportEvent {
  final String status;
  final DateTime at;

  const ReportEvent({
    required this.status,
    required this.at,
  });

  factory ReportEvent.fromJson(Map<String, dynamic> json) {
    return ReportEvent(
      status: json['status'] as String? ?? '',
      at: json['at'] != null ? DateTime.parse(json['at'] as String) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'at': at.toIso8601String(),
    };
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReportEvent &&
          runtimeType == other.runtimeType &&
          status == other.status &&
          at == other.at;

  @override
  int get hashCode => status.hashCode ^ at.hashCode;
}

@immutable
class CorrectiveAction {
  final String id;
  final String description;
  final String assignedToName;
  final DateTime dueDate;
  final String status;

  const CorrectiveAction({
    required this.id,
    required this.description,
    required this.assignedToName,
    required this.dueDate,
    required this.status,
  });

  factory CorrectiveAction.fromJson(Map<String, dynamic> json) {
    return CorrectiveAction(
      id: json['id'] as String? ?? '',
      description: json['description'] as String? ?? '',
      assignedToName: json['assigned_to_name'] as String? ?? '',
      dueDate: json['due_date'] != null
          ? DateTime.parse(json['due_date'] as String)
          : DateTime.now(),
      status: json['status'] as String? ?? 'pending',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'description': description,
      'assigned_to_name': assignedToName,
      'due_date': dueDate.toIso8601String(),
      'status': status,
    };
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CorrectiveAction &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          description == other.description &&
          assignedToName == other.assignedToName &&
          dueDate == other.dueDate &&
          status == other.status;

  @override
  int get hashCode =>
      id.hashCode ^
      description.hashCode ^
      assignedToName.hashCode ^
      dueDate.hashCode ^
      status.hashCode;
}

@immutable
class Comment {
  final String id;
  final String text;
  final String authorName;
  final DateTime createdAt;

  const Comment({
    required this.id,
    required this.text,
    required this.authorName,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as String? ?? '',
      text: json['text'] as String? ?? '',
      authorName: json['author_name'] as String? ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'author_name': authorName,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Comment &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          text == other.text &&
          authorName == other.authorName &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^ text.hashCode ^ authorName.hashCode ^ createdAt.hashCode;
}
