import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/constants/app_colors.dart';
import 'core/providers/auth_provider.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/home/presentation/home_screen.dart';
import 'features/notifications/presentation/notifications_screen.dart';
import 'features/reports/presentation/new_report/new_report_screen.dart';
import 'features/reports/presentation/report_detail_screen.dart';
import 'features/reports/presentation/reports_list_screen.dart';

class SsoApp extends ConsumerWidget {
  const SsoApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    final router = GoRouter(
      redirect: (context, state) {
        final isAuthenticated = authState.isAuthenticated;
        final isGoingToLogin = state.matchedLocation == '/login';

        // If not authenticated and not going to login, redirect to login
        if (!isAuthenticated && !isGoingToLogin) {
          return '/login';
        }

        // If authenticated and trying to access login, redirect to home
        if (isAuthenticated && isGoingToLogin) {
          return '/';
        }

        // No redirect needed
        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/reports',
          builder: (context, state) => const ReportsListScreen(),
        ),
        GoRoute(
          path: '/reports/new',
          builder: (context, state) => const NewReportScreen(),
        ),
        GoRoute(
          path: '/reports/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ReportDetailScreen(reportId: id);
          },
        ),
        GoRoute(
          path: '/notifications',
          builder: (context, state) => const NotificationsScreen(),
        ),
      ],
      initialLocation: authState.isAuthenticated ? '/' : '/login',
    );

    return MaterialApp.router(
      title: 'SSO Field App',
      theme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
