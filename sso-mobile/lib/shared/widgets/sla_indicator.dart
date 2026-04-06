import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';

class SlaIndicator extends StatelessWidget {
  final String slaStatus;
  final bool compact;

  const SlaIndicator(
    this.slaStatus, {
    Key? key,
    this.compact = false,
  }) : super(key: key);

  Color _getSlaColor(String status) {
    switch (status.toLowerCase()) {
      case 'on_time':
      case 'a_tiempo':
        return AppColors.riskLow;
      case 'at_risk':
      case 'en_riesgo':
        return AppColors.riskMedium;
      case 'overdue':
      case 'vencido':
        return AppColors.riskHigh;
      default:
        return AppColors.textSecondary;
    }
  }

  String _getSlaLabel(String status) {
    switch (status.toLowerCase()) {
      case 'on_time':
      case 'a_tiempo':
        return 'A Tiempo';
      case 'at_risk':
      case 'en_riesgo':
        return 'En Riesgo';
      case 'overdue':
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  }

  IconData _getSlaIcon(String status) {
    switch (status.toLowerCase()) {
      case 'on_time':
      case 'a_tiempo':
        return Icons.check_circle;
      case 'at_risk':
      case 'en_riesgo':
        return Icons.warning;
      case 'overdue':
      case 'vencido':
        return Icons.cancel;
      default:
        return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getSlaColor(slaStatus);
    final label = _getSlaLabel(slaStatus);
    final icon = _getSlaIcon(slaStatus);

    if (compact) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall!.copyWith(
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall!.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
        ),
      ],
    );
  }
}
