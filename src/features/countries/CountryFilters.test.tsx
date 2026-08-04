import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountryFilters } from './CountryFilters';
import { useUIStore } from '@/stores/ui-store';

describe('CountryFilters', () => {
  beforeEach(() => {
    useUIStore.setState({
      filters: { continents: [], statuses: [] },
      searchQuery: '',
    });
  });

  it('toggles a continent filter on click', async () => {
    const user = userEvent.setup();
    render(<CountryFilters />);

    await user.click(screen.getByRole('button', { name: 'Europe' }));
    expect(useUIStore.getState().filters.continents).toEqual(['Europe']);

    await user.click(screen.getByRole('button', { name: 'Europe' }));
    expect(useUIStore.getState().filters.continents).toEqual([]);
  });

  it('toggles a status filter on click', async () => {
    const user = userEvent.setup();
    render(<CountryFilters />);

    await user.click(screen.getByRole('button', { name: 'Visited' }));
    expect(useUIStore.getState().filters.statuses).toEqual(['visited']);
  });

  it('shows a Reset button only when a filter is active, and resets on click', async () => {
    const user = userEvent.setup();
    render(<CountryFilters />);

    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Planned' }));
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(useUIStore.getState().filters).toEqual({ continents: [], statuses: [] });
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
  });
});
