import { useState } from 'react';
import { Download, FileCheck } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TemplateCard } from './components/TemplateCard';
import {
  useExportTemplates,
  useCreateExport,
  useExportJob,
  useExportHistory,
  type CreateExportRequest,
} from './api';
import { formatDateTime } from '@/lib/utils';
import type { ExportTemplate } from '@/types';

export function ReportsPage(): React.ReactElement {
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [format, setFormat] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [currentExportId, setCurrentExportId] = useState<string | null>(null);

  const { data: templates, isLoading: templatesLoading } = useExportTemplates();
  const createExport = useCreateExport();
  const { data: exportJob, isLoading: jobLoading } = useExportJob(currentExportId || '', !!currentExportId);
  const { data: history, isLoading: historyLoading } = useExportHistory();

  const handleCreateExport = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedTemplate || !format) {
      return;
    }

    try {
      const exportId = await createExport.mutateAsync({
        templateId: selectedTemplate.id,
        format,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        areaFilter: areaFilter || undefined,
      } as CreateExportRequest);

      setCurrentExportId(exportId);
    } catch (err: any) {
      console.error('Error creating export:', err);
    }
  };

  const handleDownload = (downloadUrl: string): void => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Templates */}
          <div className="lg:col-span-1">
            <Card title="Plantillas de Reporte">
              {templatesLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="md" />
                </div>
              ) : templates && templates.length > 0 ? (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate?.id === template.id}
                      onSelect={setSelectedTemplate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="No hay plantillas" description="No hay plantillas disponibles" />
              )}
            </Card>
          </div>

          {/* Right: Configuration */}
          <div className="lg:col-span-2">
            <Card title="Configurar Exportación">
              {selectedTemplate ? (
                <form onSubmit={handleCreateExport} className="space-y-4">
                  {/* Format Selection */}
                  <div>
                    <label htmlFor="format" className="block text-sm font-medium text-text-primary mb-2">
                      Formato *
                    </label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                    >
                      <option value="">Seleccionar formato...</option>
                      {selectedTemplate.formats.map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="start-date" className="block text-sm font-medium text-text-primary mb-2">
                        Fecha Inicial
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-sm font-medium text-text-primary mb-2">
                        Fecha Final
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Area Filter */}
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-text-primary mb-2">
                      Filtrar por Área
                    </label>
                    <input
                      id="area"
                      type="text"
                      value={areaFilter}
                      onChange={(e) => setAreaFilter(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                      placeholder="Dejar en blanco para todas las áreas"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!format || createExport.isPending}
                    className="w-full px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {createExport.isPending ? (
                      <>
                        <Spinner size="sm" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Generar Reporte
                      </>
                    )}
                  </button>

                  {/* Export Status */}
                  {currentExportId && exportJob && (
                    <div className="mt-6 p-4 rounded-lg bg-bg-elevated border border-border">
                      {exportJob.status === 'processing' ? (
                        <div className="flex items-center gap-3">
                          <Spinner size="sm" />
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">Generando reporte...</p>
                            <p className="text-xs text-text-secondary">Por favor espere</p>
                          </div>
                        </div>
                      ) : exportJob.status === 'ready' ? (
                        <div className="flex items-start gap-3">
                          <FileCheck className="w-5 h-5 text-risk-low flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-risk-low mb-2">Reporte Listo</p>
                            <button
                              onClick={() => exportJob.downloadUrl && handleDownload(exportJob.downloadUrl)}
                              className="px-4 py-2 rounded-md bg-risk-low text-white text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                              Descargar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-risk-high">
                          <p className="font-medium">Error al generar reporte</p>
                          <p className="text-xs text-text-secondary mt-1">Por favor intente de nuevo</p>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              ) : (
                <EmptyState
                  title="Selecciona una plantilla"
                  description="Elige una plantilla de reporte para comenzar"
                />
              )}
            </Card>
          </div>
        </div>

        {/* History */}
        <Card title="Historial de Exportaciones">
          {historyLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Formato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((job) => (
                    <tr key={job.exportId} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-text-primary">{job.filename || 'Reporte'}</p>
                      </td>
                      <td className="px-6 py-4 text-text-primary text-sm">
                        {job.format.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-sm">
                        {job.fileSizeKb ? `${(job.fileSizeKb / 1024).toFixed(2)} MB` : '—'}
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-sm">
                        {formatDateTime(job.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {job.status === 'ready' && job.downloadUrl ? (
                          <button
                            onClick={() => handleDownload(job.downloadUrl!)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Descargar
                          </button>
                        ) : (
                          <span className="text-xs text-text-secondary">
                            {job.status === 'processing' ? 'Procesando...' : 'Fallido'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Sin historial" description="No hay exportaciones previas" />
          )}
        </Card>
      </div>
    </Layout>
  );
}
