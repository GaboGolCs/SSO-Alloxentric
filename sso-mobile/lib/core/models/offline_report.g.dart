// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offline_report.dart';

class OfflineReportAdapter extends TypeAdapter<OfflineReport> {
  @override
  final int typeId = 0;

  @override
  OfflineReport read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return OfflineReport(
      localId: fields[0] as String,
      areaId: fields[1] as String,
      type: fields[2] as String,
      isIap: fields[3] as bool,
      description: fields[4] as String,
      shift: fields[5] as String,
      photoPath: fields[6] as String,
      status: fields[7] as String,
      createdAt: fields[8] as DateTime,
      retryCount: fields[9] as int,
    );
  }

  @override
  void write(BinaryWriter writer, OfflineReport obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.localId)
      ..writeByte(1)
      ..write(obj.areaId)
      ..writeByte(2)
      ..write(obj.type)
      ..writeByte(3)
      ..write(obj.isIap)
      ..writeByte(4)
      ..write(obj.description)
      ..writeByte(5)
      ..write(obj.shift)
      ..writeByte(6)
      ..write(obj.photoPath)
      ..writeByte(7)
      ..write(obj.status)
      ..writeByte(8)
      ..write(obj.createdAt)
      ..writeByte(9)
      ..write(obj.retryCount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OfflineReportAdapter && runtimeType == other.runtimeType && typeId == other.typeId;
}
