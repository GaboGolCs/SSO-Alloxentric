import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps): React.ReactElement {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';

  const variantClasses: Record<string, string> = {
    success: 'bg-green-900 text-green-200',
    warning: 'bg-yellow-900 text-yellow-200',
    danger: 'bg-risk-high text-white',
    info: 'bg-blue-900 text-blue-200',
    default: 'bg-gray-700 text-gray-300',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
