import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import type { TrendDataPoint } from '@/types';

interface TrendChartProps {
  data: TrendDataPoint[] | undefined;
  isLoading: boolean;
}

export function TrendChart({ data, isLoading }: TrendChartProps): React.ReactElement {
  return (
    <Card title="Tendencia de Riesgos" className="flex flex-col">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex-1 -mx-6 -mb-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis
                dataKey="date"
                stroke="#8B949E"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#8B949E"
                style={{ fontSize: '12px' }}
                label={{ value: 'Índice de Riesgo (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#8B949E"
                style={{ fontSize: '12px' }}
                label={{ value: 'Reportes Abiertos', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  borderRadius: '6px',
                  color: '#F0F6FC',
                }}
                cursor={{ stroke: '#E85A2A', strokeWidth: 1 }}
              />
              <Legend
                wrapperStyle={{ color: '#8B949E' }}
                iconType="line"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="globalRiskScore"
                stroke="#E85A2A"
                strokeWidth={2}
                dot={{ fill: '#E85A2A', r: 4 }}
                activeDot={{ r: 6 }}
                name="Índice de Riesgo Global"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="openReports"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ fill: '#0EA5E9', r: 4 }}
                activeDot={{ r: 6 }}
                name="Reportes Abiertos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 text-text-secondary">
          No hay datos disponibles
        </div>
      )}
    </Card>
  );
}
