import 'package:flutter/material.dart';

class AppColors {
  // Primary colors
  static const Color primary = Color(0xFFE85A2A); // Safety orange
  static const Color primaryDark = Color(0xFFD14820);

  // Background colors
  static const Color bgDark = Color(0xFF0D1117);
  static const Color bgCard = Color(0xFF161B22);
  static const Color bgElevated = Color(0xFF1C2128);

  // Risk level colors
  static const Color riskHigh = Color(0xFFFF4757);
  static const Color riskMedium = Color(0xFFFFA502);
  static const Color riskLow = Color(0xFF2ED573);

  // Text colors
  static const Color textPrimary = Color(0xFFF0F6FC);
  static const Color textSecondary = Color(0xFF8B949E);

  // UI elements
  static const Color border = Color(0xFF30363D);
  static const Color accent = Color(0xFF58A6FF);

  // Status-specific colors
  static const Color statusSubmitted = Color(0xFF58A6FF); // blue
  static const Color statusUnderReview = Color(0xFFFFA502); // orange
  static const Color statusActionAssigned = Color(0xFF79C0FF); // light blue
  static const Color statusClosed = Color(0xFF2ED573); // green
}
