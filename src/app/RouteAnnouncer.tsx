import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Map',
  '/countries': 'Countries',
  '/statistics': 'Statistics',
  '/settings': 'Settings',
};

export function RouteAnnouncer() {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const name = PAGE_NAMES[location.pathname] ?? 'Page';
    setMessage(`Navigated to ${name}`);
  }, [location.pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
