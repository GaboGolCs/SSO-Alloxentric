import { Badge } from '@/components/ui/Badge';
import { getStatusLabel, getStatusBadgeColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
  const colors = getStatusBadgeColor(status);

  return (
    <div className={`${colors.bg} ${colors.text} inline-flex px-3 py-1 rounded-full text-xs font-medium`}>
      {getStatusLabel(status)}
    </div>
  );
}
