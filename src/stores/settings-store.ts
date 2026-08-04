import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

interface SettingsStore extends UserSettings {
  updateSettings: (patch: Partial<UserSettings>) => void;
  resetSettings: () => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (patch) => set((s) => ({ ...s, ...patch })),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
    }),
    {
      name: 'mappa-settings',
      version: 1,
    },
  ),
);
