import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function Card({ children, title, action, className, headerClassName }: CardProps): React.ReactElement {
  return (
    <div className={cn('bg-bg-card border border-border rounded-lg', className)}>
      {title && (
        <div className={cn('px-6 py-4 border-b border-border flex items-center justify-between', headerClassName)}>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
