import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useCreateAction } from '../api';

interface ActionFormProps {
  incidentId: string;
  onSuccess?: () => void;
}

export function ActionForm({ incidentId, onSuccess }: ActionFormProps): React.ReactElement {
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [assignedToName, setAssignedToName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const createAction = useCreateAction(incidentId);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!description || !assignedToId || !dueDate) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      await createAction.mutateAsync({
        description,
        assignedTo: { id: assignedToId, name: assignedToName },
        dueDate,
      });

      setDescription('');
      setAssignedToId('');
      setAssignedToName('');
      setDueDate('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear acción');
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
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          Descripción de la Acción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
          rows={3}
          placeholder="Descripción de la acción correctiva..."
          disabled={createAction.isPending}
        />
      </div>

      <div>
        <label htmlFor="assigned-to" className="block text-sm font-medium text-text-primary mb-2">
          Asignado a
        </label>
        <input
          id="assigned-to"
          type="text"
          value={assignedToName}
          onChange={(e) => {
            setAssignedToName(e.target.value);
            setAssignedToId(e.target.value.toLowerCase().replace(' ', '_'));
          }}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
          placeholder="Nombre de la persona responsable"
          disabled={createAction.isPending}
        />
      </div>

      <div>
        <label htmlFor="due-date" className="block text-sm font-medium text-text-primary mb-2">
          Fecha de Vencimiento
        </label>
        <input
          id="due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
          disabled={createAction.isPending}
        />
      </div>

      <button
        type="submit"
        disabled={createAction.isPending}
        className="w-full px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {createAction.isPending ? (
          <>
            <Spinner size="sm" />
            Creando acción...
          </>
        ) : (
          'Crear Acción'
        )}
      </button>
    </form>
  );
}
