import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusSelector } from './StatusSelector';

describe('StatusSelector', () => {
  it('marks the current value as active', () => {
    render(<StatusSelector value="planned" onChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: 'Planned' })).toHaveAttribute(
      'data-state',
      'on',
    );
    expect(screen.getByRole('radio', { name: 'Visited' })).toHaveAttribute(
      'data-state',
      'off',
    );
  });

  it('calls onChange with the clicked status', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatusSelector value="not_visited" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Visited' }));

    expect(onChange).toHaveBeenCalledWith('visited');
  });

  it('renders all three status options', () => {
    render(<StatusSelector value="not_visited" onChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: 'Not Visited' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Planned' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Visited' })).toBeInTheDocument();
  });
});
