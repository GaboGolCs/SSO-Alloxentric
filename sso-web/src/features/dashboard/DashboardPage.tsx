import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { KPICards } from './components/KPICards';
import { HeatMap } from './components/HeatMap';
import { TopAreas } from './components/TopAreas';
import { TrendChart } from './components/TrendChart';
import { useKPIs, useTrends, useHeatmap, useTopAreas } from './api';

type Period = '1d' | '7d' | '30d';

export function DashboardPage(): React.ReactElement {
  const [period, setPeriod] = useState<Period>('7d');

  const { data: kpis, isLoading: kpisLoading } = useKPIs(period);
  const { data: trends, isLoading: trendsLoading } = useTrends(period === '1d' ? 7 : period === '7d' ? 7 : 30);
  const { data: zones, isLoading: zonesLoading } = useHeatmap(period);
  const { data: topAreas, isLoading: topAreasLoading } = useTopAreas(5, period);

  const periodButtons = [
    { label: 'Último día', value: '1d' as Period },
    { label: 'Últimos 7 días', value: '7d' as Period },
    { label: 'Últimos 30 días', value: '30d' as Period },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="flex gap-3 flex-wrap">
          {periodButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setPeriod(btn.value)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                period === btn.value
                  ? 'bg-primary text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:border-primary hover:text-text-primary'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <KPICards kpis={kpis} isLoading={kpisLoading} />

        {/* Main Grid: HeatMap + TopAreas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HeatMap zones={zones} isLoading={zonesLoading} />
          </div>
          <div className="lg:col-span-1">
            <TopAreas areas={topAreas} isLoading={topAreasLoading} />
          </div>
        </div>

        {/* Trends Chart */}
        <TrendChart data={trends} isLoading={trendsLoading} />
      </div>
    </Layout>
  );
}
