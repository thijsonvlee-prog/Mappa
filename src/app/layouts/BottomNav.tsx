import { NavLink, useLocation } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings } from 'lucide-react';
import { m } from 'motion/react';
import { cn } from '@/lib/utils';
import { springPop } from '@/lib/motion';

const navItems = [
  { to: '/', icon: Globe2, label: 'Atlas' },
  { to: '/countries', icon: BookOpen, label: 'Landen' },
  { to: '/statistics', icon: Compass, label: 'Ontdek' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) =>
      item.to === '/' ? pathname === '/' : pathname.startsWith(item.to),
    ),
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm"
      aria-label="Main navigation"
    >
      <div className="relative">
        {/* The pill slides between tabs rather than blinking on and off. Done
            as a plain transform transition rather than framer's layoutId,
            which would pull in the much larger domMax feature bundle for this
            one effect. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-0 w-1/4 px-2 transition-transform duration-300"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <div className="h-full w-full rounded-[var(--radius-lg)] bg-primary-light" />
        </div>

        <ul className="relative flex items-center justify-around">
          {navItems.map((item, index) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-foreground-muted hover:text-foreground',
                  )
                }
              >
                <m.span
                  className="inline-flex"
                  animate={{ scale: index === activeIndex ? [1, 1.18, 1] : 1 }}
                  transition={springPop}
                >
                  <item.icon className="h-5 w-5" />
                </m.span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
