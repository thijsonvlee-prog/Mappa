import { NavLink } from 'react-router-dom';
import { Map, List, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Map, label: 'Map' },
  { to: '/countries', icon: List, label: 'Countries' },
  { to: '/statistics', icon: BarChart3, label: 'Statistics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          M
        </div>
        <span className="text-lg font-bold text-foreground">Mappa</span>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
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
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-foreground-muted">
          Your data stays local.
        </p>
      </div>
    </aside>
  );
}
