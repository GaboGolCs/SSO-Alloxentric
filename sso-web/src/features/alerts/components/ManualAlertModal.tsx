import { useState } from 'react';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useCreateManualAlert } from '../api';

interface ManualAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualAlertModal({ isOpen, onClose }: ManualAlertModalProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  const createAlert = useCreateManualAlert();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!title || !body) {
      setError('Por favor complete los campos obligatorios');
      return;
    }

    try {
      await createAlert.mutateAsync({
        title,
        body,
        zoneName: zoneName || undefined,
        severity,
      });

      setTitle('');
      setBody('');
      setZoneName('');
      setSeverity('medium');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear alerta');
    }
  };

  if (!isOpen) return <></>;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg-card border border-border rounded-lg shadow-xl z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Generar Alerta Manual</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-elevated rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-risk-high/10 border border-risk-high text-risk-high text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              placeholder="Título de la alerta"
              disabled={createAlert.isPending}
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-text-primary mb-2">
              Descripción *
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
              placeholder="Detalles de la alerta"
              rows={4}
              disabled={createAlert.isPending}
            />
          </div>

          {/* Zone Name */}
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-text-primary mb-2">
              Área / Zona
            </label>
            <input
              id="zone"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              placeholder="Área afectada (opcional)"
              disabled={createAlert.isPending}
            />
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-text-primary mb-2">
              Severidad
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              disabled={createAlert.isPending}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createAlert.isPending}
              className="flex-1 px-4 py-2 rounded-md border border-border text-text-primary hover:bg-bg-elevated disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createAlert.isPending}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {createAlert.isPending ? (
                <>
                  <Spinner size="sm" />
                  Enviando...
                </>
              ) : (
                'Enviar Alerta'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
