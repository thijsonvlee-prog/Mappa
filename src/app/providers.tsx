import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

function ThemeProvider({ children }: { children: ReactNode }) {
  useTheme();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipPrimitive.Provider delayDuration={300}>
        {children}
      </TooltipPrimitive.Provider>
    </ThemeProvider>
  );
}
