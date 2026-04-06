import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps): React.ReactElement {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('inline-flex', className)}>
      <div
        className={cn(
          'border-2 border-border border-t-primary rounded-full animate-spin',
          sizeMap[size],
        )}
      />
    </div>
  );
}
