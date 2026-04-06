import { Circle } from 'lucide-react';
import { getSlaColor, getStatusLabel } from '@/lib/utils';

interface SLABadgeProps {
  status: 'on_time' | 'at_risk' | 'overdue';
}

export function SLABadge({ status }: SLABadgeProps): React.ReactElement {
  const color = getSlaColor(status);

  return (
    <div className="flex items-center gap-2">
      <Circle
        className="w-3 h-3"
        fill={color}
        stroke={color}
      />
      <span className="text-xs font-medium text-text-secondary">
        {getStatusLabel(status)}
      </span>
    </div>
  );
}
