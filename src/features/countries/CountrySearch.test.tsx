import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountrySearch } from './CountrySearch';
import { useUIStore } from '@/stores/ui-store';

describe('CountrySearch', () => {
  beforeEach(() => {
    useUIStore.setState({ searchQuery: '' });
  });

  it('updates the ui-store searchQuery after the debounce delay', async () => {
    const user = userEvent.setup();
    render(<CountrySearch />);

    await user.type(screen.getByPlaceholderText('Search countries...'), 'Japan');

    await waitFor(
      () => {
        expect(useUIStore.getState().searchQuery).toBe('Japan');
      },
      { timeout: 1000 },
    );
  });

  it('shows a clear button once text is entered and clears the query on click', async () => {
    const user = userEvent.setup();
    render(<CountrySearch />);

    const input = screen.getByPlaceholderText('Search countries...');
    await user.type(input, 'Peru');

    const clearButton = await screen.findByRole('button');
    await user.click(clearButton);

    expect(input).toHaveValue('');
    await waitFor(() => {
      expect(useUIStore.getState().searchQuery).toBe('');
    });
  });
});
