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

    await user.click(screen.getByRole('button', { name: 'Europa' }));
    expect(useUIStore.getState().filters.continents).toEqual(['Europe']);

    await user.click(screen.getByRole('button', { name: 'Europa' }));
    expect(useUIStore.getState().filters.continents).toEqual([]);
  });

  it('toggles a status filter on click', async () => {
    const user = userEvent.setup();
    render(<CountryFilters />);

    await user.click(screen.getByRole('button', { name: 'Bezocht' }));
    expect(useUIStore.getState().filters.statuses).toEqual(['visited']);
  });

  it('shows a Reset button only when a filter is active, and resets on click', async () => {
    const user = userEvent.setup();
    render(<CountryFilters />);

    expect(screen.queryByRole('button', { name: 'Wissen' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Gepland' }));
    expect(screen.getByRole('button', { name: 'Wissen' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Wissen' }));
    expect(useUIStore.getState().filters).toEqual({ continents: [], statuses: [] });
    expect(screen.queryByRole('button', { name: 'Wissen' })).not.toBeInTheDocument();
  });
});
