import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import type { Zone } from '@/types';

interface HeatMapProps {
  zones: Zone[] | undefined;
  isLoading: boolean;
}

export function HeatMap({ zones, isLoading }: HeatMapProps): React.ReactElement {
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-8 flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'high':
        return 'rgba(255, 71, 87, 0.6)';
      case 'medium':
        return 'rgba(255, 165, 2, 0.6)';
      case 'low':
        return 'rgba(46, 213, 115, 0.6)';
      default:
        return 'rgba(139, 148, 158, 0.6)';
    }
  };

  const getRiskBorderColor = (level: string): string => {
    switch (level) {
      case 'high':
        return '#FF4757';
      case 'medium':
        return '#FFA502';
      case 'low':
        return '#2ED573';
      default:
        return '#8B949E';
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-lg p-6 h-96 flex flex-col">
      <div className="flex-1 relative bg-bg-elevated rounded-lg overflow-auto">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Plant floor background */}
          <rect width="1000" height="600" fill="#161B22" />
          <text
            x="500"
            y="50"
            textAnchor="middle"
            className="text-sm"
            fill="#8B949E"
          >
            Planta Industrial
          </text>

          {/* Zones */}
          {zones?.map((zone, idx) => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const x = col * 320 + 50;
            const y = row * 200 + 100;
            const width = 280;
            const height = 150;

            return (
              <g key={zone.zoneId}>
                {/* Zone background */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={getRiskColor(zone.riskLevel)}
                  stroke={getRiskBorderColor(zone.riskLevel)}
                  strokeWidth="2"
                  rx="4"
                  className="cursor-pointer hover:filter hover:brightness-110 transition-all"
                  onMouseEnter={() => setHoveredZone(zone.zoneId)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => navigate(`/incidents?zone=${zone.zoneId}`)}
                />

                {/* Zone text */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 - 20}
                  textAnchor="middle"
                  className="text-sm font-semibold"
                  fill="#F0F6FC"
                  pointerEvents="none"
                >
                  {zone.name}
                </text>

                {/* Risk score */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 10}
                  textAnchor="middle"
                  className="text-xs"
                  fill="#F0F6FC"
                  pointerEvents="none"
                >
                  Riesgo: {zone.riskScore}%
                </text>

                {/* Open reports */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 35}
                  textAnchor="middle"
                  className="text-xs"
                  fill="#8B949E"
                  pointerEvents="none"
                >
                  {zone.openReports} reportes abiertos
                </text>

                {/* Tooltip on hover */}
                {hoveredZone === zone.zoneId && (
                  <g>
                    <rect
                      x={x}
                      y={y - 80}
                      width="220"
                      height="70"
                      fill="#1C2128"
                      stroke="#30363D"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={x + 10}
                      y={y - 60}
                      className="text-xs font-semibold"
                      fill="#F0F6FC"
                    >
                      {zone.name}
                    </text>
                    <text
                      x={x + 10}
                      y={y - 45}
                      className="text-xs"
                      fill="#8B949E"
                    >
                      Riesgo: {zone.riskScore}%
                    </text>
                    <text
                      x={x + 10}
                      y={y - 30}
                      className="text-xs"
                      fill="#8B949E"
                    >
                      Reportes: {zone.openReports}
                    </text>
                    <text
                      x={x + 10}
                      y={y - 15}
                      className="text-xs"
                      fill="#8B949E"
                    >
                      Tendencia: {zone.trend}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getRiskColor('high') }} />
          <span className="text-xs text-text-secondary">Riesgo Alto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getRiskColor('medium') }} />
          <span className="text-xs text-text-secondary">Riesgo Medio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getRiskColor('low') }} />
          <span className="text-xs text-text-secondary">Riesgo Bajo</span>
        </div>
      </div>
    </div>
  );
}
