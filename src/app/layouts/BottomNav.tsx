import { NavLink } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Globe2, label: 'Atlas' },
  { to: '/countries', icon: BookOpen, label: 'Landen' },
  { to: '/statistics', icon: Compass, label: 'Ontdek' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground-muted hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'rounded-lg p-1.5 transition-colors',
                      isActive ? 'bg-primary-light' : 'bg-transparent',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:inline">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
