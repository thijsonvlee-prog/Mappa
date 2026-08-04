import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useIsDesktop } from '@/hooks/useMediaQuery';

export function RootLayout() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <CommandPalette />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
