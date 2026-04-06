import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/error_widget.dart' as error_widget;
import '../../../shared/widgets/loading_widget.dart';
import '../../../shared/widgets/report_card.dart';
import '../domain/reports_provider.dart';

class ReportsListScreen extends ConsumerStatefulWidget {
  const ReportsListScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ReportsListScreen> createState() => _ReportsListScreenState();
}

class _ReportsListScreenState extends ConsumerState<ReportsListScreen> {
  String? _selectedStatus;

  @override
  Widget build(BuildContext context) {
    final reportsAsync = ref.watch(reportsListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Reportes'),
      ),
      body: Column(
        children: [
          // Filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                FilterChip(
                  label: const Text('Todos'),
                  selected: _selectedStatus == null,
                  onSelected: (selected) {
                    setState(() => _selectedStatus = null);
                    ref
                        .read(reportsListProvider.notifier)
                        .filterByStatus(null);
                  },
                ),
                const SizedBox(width: 8),
                FilterChip(
                  label: const Text('Pendientes'),
                  selected: _selectedStatus == 'submitted',
                  onSelected: (selected) {
                    setState(() =>
                        _selectedStatus = selected ? 'submitted' : null);
                    ref
                        .read(reportsListProvider.notifier)
                        .filterByStatus(selected ? 'submitted' : null);
                  },
                ),
                const SizedBox(width: 8),
                FilterChip(
                  label: const Text('IAP'),
                  selected: _selectedStatus == 'iap',
                  onSelected: (selected) {
                    setState(
                        () => _selectedStatus = selected ? 'iap' : null);
                    ref
                        .read(reportsListProvider.notifier)
                        .filterByStatus(selected ? 'iap' : null);
                  },
                ),
                const SizedBox(width: 8),
                FilterChip(
                  label: const Text('Vencidos'),
                  selected: _selectedStatus == 'overdue',
                  onSelected: (selected) {
                    setState(
                        () => _selectedStatus = selected ? 'overdue' : null);
                    ref
                        .read(reportsListProvider.notifier)
                        .filterByStatus(selected ? 'overdue' : null);
                  },
                ),
              ],
            ),
          ),
          // Reports list
          Expanded(
            child: reportsAsync.when(
              loading: () => const LoadingWidget(
                message: 'Cargando reportes...',
              ),
              error: (error, stack) => error_widget.ErrorWidget(
                message: 'Error al cargar los reportes. Intenta de nuevo.',
                onRetry: () => ref.refresh(reportsListProvider),
              ),
              data: (paginatedReports) {
                if (paginatedReports.reports.isEmpty) {
                  return EmptyStateWidget(
                    title: 'Sin reportes',
                    message: 'No tienes reportes con estos filtros',
                    icon: Icons.assignment_outlined,
                    onAction: () => context.push('/reports/new'),
                    actionLabel: 'Crear reporte',
                  );
                }

                return RefreshIndicator(
                  onRefresh: () =>
                      ref.read(reportsListProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.only(bottom: 80),
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
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/reports/new'),
        label: const Text('REPORTAR'),
        icon: const Icon(Icons.add),
      ),
    );
  }
}
