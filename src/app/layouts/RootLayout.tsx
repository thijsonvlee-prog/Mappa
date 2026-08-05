import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { CountryDetailSheet } from '@/features/countries/CountryDetailSheet';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteAnnouncer } from '@/app/RouteAnnouncer';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useUIStore } from '@/stores/ui-store';

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}

export function RootLayout() {
  const isDesktop = useIsDesktop();
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);

  if (isDesktop) {
    const sidebarWidth = isSidebarCollapsed ? '64px' : '224px';
    return (
      <div className="flex h-screen overflow-hidden">
        <SkipLink />
        <RouteAnnouncer />
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-auto" style={{ marginLeft: sidebarWidth }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <CommandPalette />
        <CountryDetailSheet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <RouteAnnouncer />
      <Header />
      <main id="main-content" className="flex-1 pb-16">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <BottomNav />
      <CommandPalette />
      <CountryDetailSheet />
    </div>
  );
}
