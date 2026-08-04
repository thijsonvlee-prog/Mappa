import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

const navItems = [
  { to: '/', icon: Globe2, label: 'Atlas' },
  { to: '/countries', icon: BookOpen, label: 'Landen' },
  { to: '/statistics', icon: Compass, label: 'Ontdek' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      'flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-out',
      isCollapsed ? 'w-16' : 'w-64',
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              M
            </div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Mappa</span>
          </div>
        )}
        <IconButton
          size="sm"
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </IconButton>
      </div>

      <nav className="flex-1 px-2 py-4" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground',
                    isCollapsed && 'justify-center px-2',
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-foreground-muted">
            All data stays local.
          </p>
        </div>
      )}
    </aside>
  );
}
