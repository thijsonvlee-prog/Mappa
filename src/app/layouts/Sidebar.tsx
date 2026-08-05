import { NavLink } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

const navItems = [
  { to: '/', icon: Globe2, label: 'Atlas' },
  { to: '/countries', icon: BookOpen, label: 'Landen' },
  { to: '/statistics', icon: Compass, label: 'Ontdek' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
];

export function Sidebar() {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleSidebarCollapsed);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Logo/Header */}
      <div className={cn('flex h-16 items-center border-b border-border', isCollapsed ? 'justify-center' : 'justify-between px-4')}>
        <div className={cn('flex items-center gap-2', isCollapsed && 'hidden')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground font-bold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
            M
          </div>
          <span className="font-semibold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>Mappa</span>
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleCollapsed}
            className="rounded-[var(--radius-md)] p-1.5 hover:bg-background-secondary transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4 text-foreground-muted" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={toggleCollapsed}
            className="rounded-[var(--radius-md)] p-1.5 hover:bg-background-secondary transition-colors"
            title="Expand sidebar"
          >
            <Globe2 className="h-5 w-5 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors',
                    isCollapsed && 'justify-center',
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground',
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn('border-t border-border p-3', isCollapsed && 'text-center')}>
        <p className="text-xs text-foreground-muted line-clamp-2">
          {isCollapsed ? '📍' : 'Jouw data blijft lokaal.'}
        </p>
      </div>
    </aside>
  );
}
