import { NavLink } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Globe2, label: 'Atlas' },
  { to: '/countries', icon: BookOpen, label: 'Landen' },
  { to: '/statistics', icon: Compass, label: 'Ontdek' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
          M
        </div>
        <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Mappa</span>
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
