import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { useHydration } from '@/hooks/useHydration';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';

function AppContent() {
  const ready = useHydration();
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            M
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!onboardingCompleted) {
    return <OnboardingFlow />;
  }

  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
