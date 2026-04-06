import 'package:flutter/foundation.dart';

@immutable
class Zone {
  final String id;
  final String name;
  final String? process;

  const Zone({
    required this.id,
    required this.name,
    this.process,
  });

  factory Zone.fromJson(Map<String, dynamic> json) {
    return Zone(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      process: json['process'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      if (process != null) 'process': process,
    };
  }

  Zone copyWith({
    String? id,
    String? name,
    String? process,
  }) {
    return Zone(
      id: id ?? this.id,
      name: name ?? this.name,
      process: process ?? this.process,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Zone &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          process == other.process;

  @override
  int get hashCode => id.hashCode ^ name.hashCode ^ process.hashCode;
}
