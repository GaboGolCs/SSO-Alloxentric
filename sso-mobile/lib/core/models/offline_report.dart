import 'package:hive/hive.dart';

part 'offline_report.g.dart';

@HiveType(typeId: 0)
class OfflineReport extends HiveObject {
  @HiveField(0)
  late String localId;

  @HiveField(1)
  late String areaId;

  @HiveField(2)
  late String type;

  @HiveField(3)
  late bool isIap;

  @HiveField(4)
  late String description;

  @HiveField(5)
  late String shift;

  @HiveField(6)
  late String photoPath; // local file path

  @HiveField(7)
  late String status; // queued, syncing, failed

  @HiveField(8)
  late DateTime createdAt;

  @HiveField(9)
  late int retryCount;

  OfflineReport({
    required this.localId,
    required this.areaId,
    required this.type,
    required this.isIap,
    required this.description,
    required this.shift,
    required this.photoPath,
    required this.status,
    required this.createdAt,
    required this.retryCount,
  });

  OfflineReport copyWith({
    String? localId,
    String? areaId,
    String? type,
    bool? isIap,
    String? description,
    String? shift,
    String? photoPath,
    String? status,
    DateTime? createdAt,
    int? retryCount,
  }) {
    return OfflineReport(
      localId: localId ?? this.localId,
      areaId: areaId ?? this.areaId,
      type: type ?? this.type,
      isIap: isIap ?? this.isIap,
      description: description ?? this.description,
      shift: shift ?? this.shift,
      photoPath: photoPath ?? this.photoPath,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      retryCount: retryCount ?? this.retryCount,
    );
  }
}
