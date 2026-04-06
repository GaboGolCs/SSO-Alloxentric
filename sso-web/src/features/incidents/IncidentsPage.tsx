import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from './components/StatusBadge';
import { SLABadge } from './components/SLABadge';
import { useIncidents } from './api';
import { formatDateTime, getIncidentTypeLabel, getShiftLabel } from '@/lib/utils';

export function IncidentsPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const zoneId = searchParams.get('zone') || undefined;
  const filters = {
    status: statusFilter || undefined,
    zoneId,
    search: searchTerm || undefined,
    page,
    pageSize: 10,
  };

  const { data, isLoading } = useIncidents(filters);

  const filterChips = [
    { label: 'Todos', value: '' },
    { label: 'Pendientes', value: 'submitted' },
    { label: 'En Revisión', value: 'under_review' },
    { label: 'IAP', value: 'isIap' },
    { label: 'Vencidos', value: 'overdue' },
  ];

  const incidents = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Filter Bar */}
        <Card>
          <div className="space-y-4">
            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              {filterChips.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => {
                    setStatusFilter(chip.value === 'isIap' ? '' : chip.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    statusFilter === chip.value
                      ? 'bg-primary text-white'
                      : 'bg-bg-elevated border border-border text-text-secondary hover:border-primary hover:text-text-primary'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por ID, área, descripción..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Stats */}
        {incidents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Total de Reportes</p>
              <p className="text-2xl font-bold text-primary">{pagination?.total || 0}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">IAP Activos</p>
              <p className="text-2xl font-bold text-risk-high">{incidents.filter((i) => i.isIap).length}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-text-secondary">Vencidos</p>
              <p className="text-2xl font-bold text-risk-high">{incidents.filter((i) => i.slaStatus === 'overdue').length}</p>
            </Card>
          </div>
        )}

        {/* Incidents Table */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : incidents.length === 0 ? (
            <EmptyState title="No hay incidentes" description="No se encontraron incidentes con los filtros seleccionados" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      ID / Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Turno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      SLA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                      className="border-b border-border hover:bg-bg-elevated/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        {incident.photoUrl ? (
                          <img
                            src={incident.photoUrl}
                            alt="Incident"
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-bg-elevated flex items-center justify-center text-text-secondary text-xs">
                            —
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-text-primary">{incident.id}</p>
                          <p className="text-xs text-text-secondary">
                            {formatDateTime(incident.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-primary">{incident.zoneName}</td>
                      <td className="px-6 py-4 text-text-primary text-sm">
                        {getShiftLabel(incident.shift)}
                      </td>
                      <td className="px-6 py-4 text-text-primary text-sm">
                        {incident.responsible?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={incident.status} />
                      </td>
                      <td className="px-6 py-4">
                        <SLABadge status={incident.slaStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {incident.isIap && (
                            <span className="px-2 py-1 rounded-full text-xs bg-risk-high text-white font-medium">
                              IAP
                            </span>
                          )}
                          <span className="text-text-secondary text-xs">
                            {getIncidentTypeLabel(incident.type)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-text-secondary">
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} resultados)
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
    </Layout>
  );
}
