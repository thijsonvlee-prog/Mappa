import { create } from 'zustand';
import type { Continent, CountryStatus } from '@/types';

interface UIStoreState {
  selectedCountryCode: string | null;
  isDetailOpen: boolean;
  searchQuery: string;
  filters: {
    continents: Continent[];
    statuses: CountryStatus[];
  };
  sortBy: 'name' | 'status' | 'rating' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isCommandPaletteOpen: boolean;
  isMobileNavOpen: boolean;
}

interface UIStoreActions {
  selectCountry: (code: string | null) => void;
  openDetail: (code: string) => void;
  closeDetail: () => void;
  setSearchQuery: (q: string) => void;
  setFilters: (filters: Partial<UIStoreState['filters']>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: UIStoreState['sortBy']) => void;
  toggleSortDirection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

const initialFilters = { continents: [] as Continent[], statuses: [] as CountryStatus[] };

export const useUIStore = create<UIStoreState & UIStoreActions>()((set) => ({
  selectedCountryCode: null,
  isDetailOpen: false,
  searchQuery: '',
  filters: initialFilters,
  sortBy: 'name',
  sortDirection: 'asc',
  viewMode: 'grid',
  isCommandPaletteOpen: false,
  isMobileNavOpen: false,

  selectCountry: (code) => set({ selectedCountryCode: code }),
  openDetail: (code) => set({ selectedCountryCode: code, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: initialFilters, searchQuery: '' }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortDirection: () =>
    set((s) => ({ sortDirection: s.sortDirection === 'asc' ? 'desc' : 'asc' })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
