import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from './layouts/RootLayout';

const MapPage = lazy(() => import('@/features/map/MapPage').then(m => ({ default: m.MapPage })));
const CountryListPage = lazy(() => import('@/features/countries/CountryListPage').then(m => ({ default: m.CountryListPage })));
const StatisticsPage = lazy(() => import('@/features/statistics/StatisticsPage').then(m => ({ default: m.StatisticsPage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-foreground-secondary">Page not found</p>
      <a href="/" className="text-primary hover:underline">Go to Map</a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <MapPage />
          </Suspense>
        ),
      },
      {
        path: 'countries',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CountryListPage />
          </Suspense>
        ),
      },
      {
        path: 'statistics',
        element: (
          <Suspense fallback={<PageFallback />}>
            <StatisticsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
