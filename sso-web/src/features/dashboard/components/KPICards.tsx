import { TrendingUp, TrendingDown } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import type { KPIs } from '@/types';

interface KPICardsProps {
  kpis: KPIs | undefined;
  isLoading: boolean;
}

export function KPICards({ kpis, isLoading }: KPICardsProps): React.ReactElement {
  const cards = [
    {
      label: 'Total Reportes',
      value: kpis?.totalReports,
      delta: kpis?.totalReportsDelta,
      icon: '📋',
    },
    {
      label: 'IAP Activos',
      value: kpis?.activeIap,
      delta: kpis?.activeIapDelta,
      icon: '⚠️',
    },
    {
      label: 'Cumplimiento SLA',
      value: kpis?.slaComplianceRate,
      delta: undefined,
      icon: '✓',
      suffix: '%',
    },
    {
      label: 'Acciones Vencidas',
      value: kpis?.overdueActions,
      delta: undefined,
      icon: '⏱️',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">{card.label}</p>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-text-primary">
                  {card.value}
                  {card.suffix && <span className="text-sm ml-1">{card.suffix}</span>}
                </h3>
              </div>
              {card.delta !== undefined && (
                <div className="flex items-center gap-1 pt-2">
                  {card.delta > 0 ? (
                    <TrendingUp className="w-4 h-4 text-risk-high" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-risk-low" />
                  )}
                  <span
                    className={
                      card.delta > 0 ? 'text-risk-high text-xs' : 'text-risk-low text-xs'
                    }
                  >
                    {Math.abs(card.delta)}% {card.delta > 0 ? 'aumento' : 'reducción'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
