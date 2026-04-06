import { useNavigate } from 'react-router-dom';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import type { Zone } from '@/types';

interface TopAreasProps {
  areas: Zone[] | undefined;
  isLoading: boolean;
}

export function TopAreas({ areas, isLoading }: TopAreasProps): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Card
      title="Áreas Críticas"
      action={<Flame className="w-5 h-5 text-primary" />}
      className="h-96 flex flex-col"
      headerClassName="flex-shrink-0"
    >
      <div className="flex-1 overflow-auto space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="md" />
          </div>
        ) : areas && areas.length > 0 ? (
          areas.map((area, idx) => (
            <div
              key={area.zoneId}
              className="p-4 rounded-lg bg-bg-elevated border border-border hover:border-primary hover:bg-bg-dark transition-all cursor-pointer"
              onClick={() => navigate(`/incidents?zone=${area.zoneId}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-text-primary">{area.name}</p>
                    <p className="text-xs text-text-secondary">
                      {area.openReports} reportes abiertos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {area.trend === 'rising' ? (
                    <TrendingUp className="w-4 h-4 text-risk-high" />
                  ) : area.trend === 'falling' ? (
                    <TrendingDown className="w-4 h-4 text-risk-low" />
                  ) : (
                    <div className="w-4 h-4 text-text-secondary">—</div>
                  )}
                </div>
              </div>

              {/* Risk Score Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Índice de Riesgo</span>
                  <span className="text-xs font-semibold text-text-primary">
                    {area.riskScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-dark overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      area.riskLevel === 'high'
                        ? 'bg-risk-high'
                        : area.riskLevel === 'medium'
                          ? 'bg-risk-medium'
                          : 'bg-risk-low'
                    }`}
                    style={{ width: `${area.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary text-sm">
            No hay datos disponibles
          </div>
        )}
      </div>
    </Card>
  );
}
