import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Bell, FileText, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';

export function Sidebar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const navItems = [
    { path: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { path: '/incidents', label: 'Incidentes', icon: AlertTriangle },
    { path: '/alerts', label: 'Alertas', icon: Bell },
    { path: '/reports', label: 'Reportes', icon: FileText },
  ];

  const handleLogout = (): void => {
    clearAuth();
    navigate('/login');
  };

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-bg-card border border-border hover:bg-bg-elevated"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => useUIStore.setState({ sidebarOpen: false })}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-bg-card border-r border-border flex flex-col transition-transform duration-300 z-40 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-text-primary">SSO</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  useUIStore.setState({ sidebarOpen: false });
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200',
                  active
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-border space-y-4">
          {user && (
            <div className="px-3 py-3 rounded-md bg-bg-elevated">
              <p className="text-xs text-text-secondary">Usuario</p>
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-risk-high hover:bg-bg-elevated rounded-md transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
