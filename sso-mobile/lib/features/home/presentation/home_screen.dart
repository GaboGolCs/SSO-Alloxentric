import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../shared/widgets/offline_banner.dart';
import '../../../shared/widgets/report_card.dart';
import '../../notifications/domain/notifications_provider.dart';
import '../../reports/domain/reports_provider.dart';
import '../../../core/providers/connectivity_provider.dart';
import 'home_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    final connectivityAsync = ref.watch(connectivityProvider);
    final unreadCount = ref.watch(unreadCountProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SSO Field App'),
        elevation: 0,
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () => context.push('/notifications'),
              ),
              if (unreadCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: AppColors.riskHigh,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      unreadCount.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Offline banner
          connectivityAsync.when(
            data: (isConnected) {
              if (!isConnected) {
                return const OfflineBanner();
              }
              return const SizedBox.shrink();
            },
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
          // Tab content
          Expanded(
            child: IndexedStack(
              index: _selectedTabIndex,
              children: [
                // Home tab
                _HomeTabContent(),
                // My Reports tab
                _MyReportsTabContent(),
                // Profile tab
                _ProfileTabContent(),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedTabIndex,
        onTap: (index) {
          setState(() => _selectedTabIndex = index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Inicio',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: 'Reportes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
      floatingActionButton: _selectedTabIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () => context.push('/reports/new'),
              label: const Text('REPORTAR'),
              icon: const Icon(Icons.add),
            )
          : null,
    );
  }
}

class _HomeTabContent extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(workerStatsProvider);
    final recentReportsAsync = ref.watch(recentReportsProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting
          Text(
            'Bienvenido',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 24),
          // Stats cards
          statsAsync.when(
            loading: () => const LoadingWidget(
              message: 'Cargando estadísticas...',
            ),
            error: (error, stack) => const SizedBox.shrink(),
            data: (stats) => Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.assignment,
                        label: 'Reportes',
                        value: stats.reportsThisPeriod.toString(),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.flame,
                        label: 'Racha',
                        value: '${stats.participationStreakDays}d',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.trending_up,
                        label: 'Efectividad',
                        value: '${(stats.effectivenessRate * 100).toStringAsFixed(0)}%',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.star,
                        label: 'Reportes IAP',
                        value: stats.iapReports.toString(),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          // Recent reports section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Reportes Recientes',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              TextButton(
                onPressed: () {
                  // Navigate to reports list via parent navigation
                  // This would be handled by the parent widget
                },
                child: const Text('Ver todos'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          recentReportsAsync.when(
            loading: () => const LoadingWidget(),
            error: (error, stack) => EmptyStateWidget(
              title: 'Error',
              message: 'No se pudieron cargar los reportes',
            ),
            data: (reports) {
              if (reports.isEmpty) {
                return EmptyStateWidget(
                  title: 'Sin reportes',
                  message: 'Crea tu primer reporte ahora',
                  onAction: () {},
                  actionLabel: 'Crear reporte',
                );
              }
              return Column(
                children: reports
                    .map(
                      (report) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ReportCard(
                          report: report,
                          onTap: () => GoRouter.of(context)
                              .push('/reports/${report.id}'),
                        ),
                      ),
                    )
                    .toList(),
              );
            },
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _MyReportsTabContent extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportsAsync = ref.watch(reportsListProvider);

    return reportsAsync.when(
      loading: () => const LoadingWidget(
        message: 'Cargando reportes...',
      ),
      error: (error, stack) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Error al cargar reportes'),
            ElevatedButton(
              onPressed: () => ref.refresh(reportsListProvider),
              child: const Text('Reintentar'),
            ),
          ],
        ),
      ),
      data: (paginatedReports) {
        if (paginatedReports.reports.isEmpty) {
          return EmptyStateWidget(
            title: 'Sin reportes',
            message: 'Crea tu primer reporte',
            icon: Icons.assignment_outlined,
            onAction: () => context.push('/reports/new'),
            actionLabel: 'Crear reporte',
          );
        }

        return RefreshIndicator(
          onRefresh: () =>
              ref.read(reportsListProvider.notifier).refresh(),
          child: ListView.builder(
            itemCount: paginatedReports.reports.length,
            itemBuilder: (context, index) {
              final report = paginatedReports.reports[index];
              return ReportCard(
                report: report,
                onTap: () => context.push('/reports/${report.id}'),
              );
            },
          ),
        );
      },
    );
  }
}

class _ProfileTabContent extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Avatar
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                authState.user?.name.substring(0, 1).toUpperCase() ?? '?',
                style: Theme.of(context).textTheme.displayMedium!.copyWith(
                      color: Colors.white,
                    ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // User info
          Text(
            authState.user?.name ?? 'Usuario',
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              authState.user?.role ?? 'Worker',
              style: Theme.of(context).textTheme.bodySmall!.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ),
          const SizedBox(height: 32),
          // Stats
          _ProfileStatCard(
            label: 'Total Reportes',
            value: '0',
            icon: Icons.assignment,
          ),
          const SizedBox(height: 12),
          _ProfileStatCard(
            label: 'Efectividad',
            value: '0%',
            icon: Icons.trending_up,
          ),
          const SizedBox(height: 12),
          _ProfileStatCard(
            label: 'Racha Actual',
            value: '0 días',
            icon: Icons.flame,
          ),
          const SizedBox(height: 12),
          _ProfileStatCard(
            label: 'Reportes IAP',
            value: '0',
            icon: Icons.star,
          ),
          const SizedBox(height: 32),
          // Logout button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                ref.read(authProvider.notifier).logout();
                context.go('/login');
              },
              icon: const Icon(Icons.logout),
              label: const Text('Cerrar Sesión'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.riskHigh,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppColors.primary, size: 24),
            const SizedBox(height: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall!.copyWith(
                    color: AppColors.textSecondary,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall!.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileStatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _ProfileStatCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall!.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: Theme.of(context).textTheme.titleMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
          Icon(icon, color: AppColors.primary, size: 28),
        ],
      ),
    );
  }
}

// Import auth provider
import '../../../core/providers/auth_provider.dart';
