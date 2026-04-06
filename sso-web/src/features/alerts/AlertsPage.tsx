import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { AlertCard } from './components/AlertCard';
import { ManualAlertModal } from './components/ManualAlertModal';
import { useAlerts, useAlertStats, useResolveAlert } from './api';

export function AlertsPage(): React.ReactElement {
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const { data, isLoading } = useAlerts({
    type: filterType || undefined,
    status: filterType === '' ? 'active' : undefined,
    page,
    pageSize: 10,
  });
  const { data: stats, isLoading: statsLoading } = useAlertStats();
  const resolveAlert = useResolveAlert();

  const alerts = data?.data || [];
  const pagination = data?.pagination;

  const filterChips = [
    { label: 'Todas', value: '' },
    { label: 'IAP', value: 'iap' },
    { label: 'Vencimiento SLA', value: 'sla' },
    { label: 'Zona Crítica', value: 'zone' },
    { label: 'Automáticas', value: 'auto' },
  ];

  const handleResolve = async (alertId: string): Promise<void> => {
    setResolvingId(alertId);
    try {
      await resolveAlert.mutateAsync(alertId);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Alertas Activas</p>
              <p className="text-2xl font-bold text-primary">{stats.activeAlerts}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Pendientes de Revisión</p>
              <p className="text-2xl font-bold text-risk-medium">{stats.pendingReview}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Resueltas Hoy</p>
              <p className="text-2xl font-bold text-risk-low">{stats.resolvedToday}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Auto Enviadas Hoy</p>
              <p className="text-2xl font-bold text-blue-400">{stats.autoSentToday}</p>
            </Card>
          </div>
        )}

        {/* Filter and Action */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => {
                  setFilterType(chip.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filterType === chip.value
                    ? 'bg-primary text-white'
                    : 'bg-bg-card border border-border text-text-secondary hover:border-primary hover:text-text-primary'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Generar Alerta Manual
          </button>
        </div>

        {/* Alerts List */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : alerts.length === 0 ? (
            <EmptyState
              title="No hay alertas"
              description="No se encontraron alertas con los filtros seleccionados"
            />
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolve}
                  isResolving={resolvingId === alert.id}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-text-secondary">
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} alertas)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md bg-bg-elevated border border-border text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 rounded-md bg-bg-elevated border border-border text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Manual Alert Modal */}
      <ManualAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}
