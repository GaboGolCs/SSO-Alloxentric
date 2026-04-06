import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export function TopBar(): React.ReactElement {
  const location = useLocation();
  const { user } = useAuthStore();

  const getPageTitle = (): string => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Panel de Control';

    const titles: Record<string, string> = {
      dashboard: 'Panel de Control',
      incidents: 'Incidentes',
      alerts: 'Alertas',
      reports: 'Reportes',
    };

    return titles[pathSegments[0]] || 'Panel de Control';
  };

  const getInitials = (): string => {
    if (!user) return 'U';
    return user.name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="sticky top-0 z-30 bg-bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-text-primary">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-text-secondary">{user?.role || 'Usuario'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {getInitials()}
          </div>
        </div>
      </div>
    </div>
  );
}
