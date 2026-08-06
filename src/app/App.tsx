import { useEffect, lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { useHydration } from '@/hooks/useHydration';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';

// Rarely on screen, so it stays out of the eager bundle.
const MilestoneOverlay = lazy(() =>
  import('@/features/milestones/MilestoneOverlay').then((m) => ({
    default: m.MilestoneOverlay,
  })),
);

function AppContent() {
  const ready = useHydration();
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted);

  useEffect(() => {
    if (ready && navigator.storage?.persist) {
      navigator.storage.persisted().then((isPersisted) => {
        if (!isPersisted) {
          navigator.storage.persist().catch(() => {
            // Storage persistence may be denied; app continues to work offline locally
          });
        }
      }).catch(() => {
        // Storage API not available; app continues to work offline locally
      });
    }
  }, [ready]);

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

  return (
    <>
      <RouterProvider router={router} />
      {/* Mounted outside the router so a stamp survives navigation, and only
          after onboarding so its bulk marking can never trigger one. */}
      <Suspense fallback={null}>
        <MilestoneOverlay />
      </Suspense>
    </>
  );
}

export function App() {
  return (
    <ErrorBoundary
      fallbackTitle="Mappa hit an unexpected error"
      fallbackDescription="Try reloading the app. Your data stays saved on this device."
    >
      <Providers>
        <MotionProvider>
          <AppContent />
        </MotionProvider>
      </Providers>
    </ErrorBoundary>
  );
}
