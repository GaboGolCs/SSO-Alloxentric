import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { formatRelativeTime, getAlertTypeLabel, getAlertTypeColor } from '@/lib/utils';
import type { Alert } from '@/types';

interface AlertCardProps {
  alert: Alert;
  onResolve: (id: string) => Promise<void>;
  isResolving?: boolean;
}

export function AlertCard({ alert, onResolve, isResolving }: AlertCardProps): React.ReactElement {
  const navigate = useNavigate();

  const handleResolve = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    await onResolve(alert.id);
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-bg-elevated border border-border hover:border-primary transition-colors">
      {/* Type Badge */}
      <div className={`flex-shrink-0 ${getAlertTypeColor(alert.type)} rounded-lg px-3 py-2`}>
        <span className="text-xs font-semibold text-white">
          {getAlertTypeLabel(alert.type)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-text-primary mb-1">{alert.title}</h4>
        <p className="text-sm text-text-secondary mb-2 line-clamp-2">{alert.body}</p>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          {alert.zoneName && (
            <span className="bg-bg-dark px-2 py-1 rounded">{alert.zoneName}</span>
          )}
          {alert.incidentId && (
            <button
              onClick={() => navigate(`/incidents/${alert.incidentId}`)}
              className="bg-bg-dark px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
            >
              Ver incidente
            </button>
          )}
          <span>{formatRelativeTime(alert.createdAt)}</span>
        </div>
      </div>

      {/* Action Button */}
      {alert.status === 'active' && (
        <button
          onClick={handleResolve}
          disabled={isResolving}
          className="flex-shrink-0 p-2 rounded-md hover:bg-bg-dark text-text-secondary hover:text-risk-high disabled:opacity-50 transition-colors"
          title="Resolver alerta"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
