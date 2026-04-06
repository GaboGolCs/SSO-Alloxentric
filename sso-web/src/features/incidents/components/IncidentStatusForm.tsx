import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useUpdateIncident } from '../api';

interface IncidentStatusFormProps {
  incidentId: string;
  currentStatus: string;
  currentResponsible?: { id: string; name: string };
}

export function IncidentStatusForm({
  incidentId,
  currentStatus,
  currentResponsible,
}: IncidentStatusFormProps): React.ReactElement {
  const [status, setStatus] = useState(currentStatus);
  const [responsibleName, setResponsibleName] = useState(currentResponsible?.name || '');
  const [responsibleId, setResponsibleId] = useState(currentResponsible?.id || '');
  const [slaDeadline, setSlaDeadline] = useState('');
  const [error, setError] = useState('');

  const updateIncident = useUpdateIncident();

  const statusOptions = [
    { value: 'submitted', label: 'Reportado' },
    { value: 'under_review', label: 'Bajo Revisión' },
    { value: 'action_assigned', label: 'Acción Asignada' },
    { value: 'closed', label: 'Cerrado' },
  ];

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      await updateIncident.mutateAsync({
        id: incidentId,
        status,
        responsible: responsibleId ? { id: responsibleId, name: responsibleName } : undefined,
        slaDeadline: slaDeadline || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar incidente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-risk-high/10 border border-risk-high text-risk-high text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
          Estado
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
          disabled={updateIncident.isPending}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="responsible" className="block text-sm font-medium text-text-primary mb-2">
          Responsable
        </label>
        <input
          id="responsible"
          type="text"
          value={responsibleName}
          onChange={(e) => {
            setResponsibleName(e.target.value);
            setResponsibleId(e.target.value.toLowerCase().replace(' ', '_'));
          }}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
          placeholder="Nombre del responsable"
          disabled={updateIncident.isPending}
        />
      </div>

      <div>
        <label htmlFor="sla-deadline" className="block text-sm font-medium text-text-primary mb-2">
          Fecha Límite SLA
        </label>
        <input
          id="sla-deadline"
          type="date"
          value={slaDeadline}
          onChange={(e) => setSlaDeadline(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
          disabled={updateIncident.isPending}
        />
      </div>

      <button
        type="submit"
        disabled={updateIncident.isPending}
        className="w-full px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {updateIncident.isPending ? (
          <>
            <Spinner size="sm" />
            Guardando...
          </>
        ) : (
          'Guardar Cambios'
        )}
      </button>
    </form>
  );
}
