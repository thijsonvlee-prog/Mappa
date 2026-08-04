import { useEffect, useState } from 'react';
import { useCountryStore } from '@/stores/country-store';

export function useHydration() {
  const [ready, setReady] = useState(false);
  const hydrate = useCountryStore((s) => s.hydrate);
  const isHydrated = useCountryStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      hydrate().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [hydrate, isHydrated]);

  return ready;
}
