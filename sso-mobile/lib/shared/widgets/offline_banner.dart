import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';

class OfflineBanner extends StatelessWidget {
  const OfflineBanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.riskHigh.withOpacity(0.1),
        border: Border(
          bottom: BorderSide(
            color: AppColors.riskHigh,
            width: 2,
          ),
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.wifi_off,
            color: AppColors.riskHigh,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Sin conexión. Los reportes se guardarán localmente.',
              style: Theme.of(context).textTheme.bodySmall!.copyWith(
                    color: AppColors.riskHigh,
                    fontWeight: FontWeight.w500,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
